const Botkit = require('botkit');
const config = require('./config/config.js');
const func_ = require('./skill/function.js');
const Photo = require('./skill/photo.js');
const template = require('./data/template.js');

const mongoose = func_.mongoose;
const later = func_.later;
const removeDau = func_.removeDiacritics;

const natural = func_.natural;

mongoose.connect('mongodb://localhost/ts_lunch');
const DataModel = mongoose.model('data-model', func_.dataModel);

const controller = Botkit.slackbot({
    debug: false
});
const bot = controller.spawn({
    token: config.botToken
});
const lunchOp = require('./skill/lunchOp.js')(DataModel);
const botMethod = require('./skill/botMethod.js')(bot, lunchOp);

let closeDealTimeout = null;
let user_list = [];
let menu_count = {};

function resetMenu() {
    menu_count = {};
    user_list = [];
    closeDealTimeout = null;

}

controller.on('direct_mention', function (bot, message) {
    console.log(message);
    bot.reply(message, 'Wat up bro !!!!');
});

controller.hears(['hot guys'], 'direct_message,direct_mention', function (bot, message) {
    console.log(message);
    const v = "?v=" + Math.floor(Math.random() * 10000000); 
    bot.reply(message, Photo.getBoy() + v);
});
controller.hears(['hot girls'], 'direct_message,direct_mention', function (bot, message) {
    console.log(message);  
    const v = "?v=" + Math.floor(Math.random() * 10000000);
    bot.reply(message, Photo.getGirls() + v);
});


controller.hears(['bang01'], 'direct_message', function (bot, message) {
    console.log(message);
    bot.reply(message, 'Ok starting');
    config.closeDealTimeout = '18000000';
    start();
    setRemind(bot);
});
controller.hears(['close_deal'], 'direct_message', function (bot, message) {
    console.log(message);
    bot.reply(message, 'Ok starting');
    config.closeDealTimeout = '1000';
    setCloseDeal();
});

//

function startBot() {
    setTimeout(function () {
        bot.startRTM(function (err, bot, payload) {
            // config.closeDealTimeout = '65000';
            // start();

            const time = 'at 4:00 pm';
            const test_time = 'at 1:27 pm';
            const t = later.parse.text(time);
            const test_t = later.parse.text(test_time);
            // 
            later.date.localTime();

            //TEst if timer work 
            console.log('bot start running');
            later.setInterval(function () {
                console.log("RUNNINNNNNGG !!!!");
            }, test_t);


            later.setInterval(function () {
                if (botMethod.getDay() === 7 || botMethod.getDay() === 0 || botMethod.getDay() === 6) {
                    return;
                }
                config.closeDealTimeout = '3600000';
                start();
                setRemind(bot);
            }, t); 
        });
    }, 3000);
} 
 


controller.on('rtm_close', function (bot, err) {
    console.log("#network is down");
    startBot();
});

startBot();

function setRemind(bot) {
    const timeout = parseInt(config.closeDealTimeout) / 2;
    setTimeout(function () {
        if (user_list !== null && user_list.length > 1) {
            bot.say({
                text: 'Mọi người nhớ đặt cơm <!channel>',
                channel: config.channel
            });
        }
    }, timeout);
}

function start() {
    botMethod.channelUsersList((users_id_list) => {
        if (users_id_list !== null &&
            users_id_list.length > 0) {
            user_list = users_id_list; //
            //remove those users list
            let remove_list = config.excludeList;
            if (remove_list !== null && remove_list.length > 0) {
                for (let i = 0; i < remove_list.length; i++) {
                    const remove_user_id = remove_list[i];
                    if (user_list.indexOf(remove_user_id) >= 0) {
                        user_list.splice(user_list.indexOf(remove_user_id), 1);
                    }
                    if (i >= remove_list.length - 1) {
                        console.log("#USER ID LIST " + user_list);
                        buildingUserList();
                    }
                }
            } else {
                buildingUserList();
            }
        }
        console.log("#user id list");
        console.log(users_id_list);
    });
}



function buildingUserList() {
    if (user_list !== null && user_list.length > 0) {
        botMethod.buildUsername((isSuccess) => {
            startAsking();
        });
    }
}

function startAsking() {
    botMethod.getMenu(pickDate(), (menu_list) => {
        console.log("menu list ", menu_list);
        if (user_list.length < 1) {
            return;
        }
        //bang
        user_list.forEach(function (user_id, i, array) {
            botMethod.send(user_id, getAvailableDay(), menu_list, (userid, isAccept) => {
                console.log("call back " + isAccept);
                console.log(userid);
                user_list.splice(user_list.indexOf(user_id), 1);
                console.log("Current user left ", user_list);
            });
        });
    });

    if (closeDealTimeout === null) {
        setCloseDeal();
    }
}



function setCloseDeal() {
    // let receipt_list = [];
    let receipt_list = "";
    let recepit_food_list = [];

    closeDealTimeout = setTimeout(function () {
        user_list = [];
        console.log("finished close deal ");
        lunchOp.find(null, function (error, data) {
            if (data !== null && data.length > 0) {
                console.log("#Start to build recepit");
                data.forEach(function (receipt_data, i, array) {
                    console.log(receipt_data)
                    receipt_list += template.generateReceipt(receipt_data) + "\n";
                    recepit_food_list.push(receipt_data);
                    // receipt_list.push(template.generateReceipt(receipt_data));
                    if (i === array.length - 1) {
                        //More Extra
                        receipt_list += template.generateReceipt({
                            name: "Phần thêm : ",
                            food: receipt_data.food
                        }) + "\n";
                        recepit_food_list.push(receipt_data);

                        SummarizeTotal(recepit_food_list);
                        botMethod.makeAnnounce(config.channel, 'Menu mọi người day !!!', receipt_list);
                    }
                });
            }
        });

    }, config.closeDealTimeout);
}



function SummarizeTotal(list_data) {
    const lunch_list = botMethod.getLunchListData(pickDate());
    let food_list = [];
    let final_list = "";

    function com_data(com_data, i, array) {
        menu_count[com_data.title] = {
            data: [],
            price: parseInt(com_data.price)
        };

        food_list.push(com_data.title);
        if (i === array.length - 1) {
            list_data.forEach(function (food_picked, i, array) {
                let compare = [];

                food_list.forEach(function (food_value, i2, array2) {
                    if (food_value !== null && typeof food_value !== 'undefined') {
                        const v = natural.JaroWinklerDistance(removeDau(food_picked.food), removeDau(food_value));
                        compare.push({
                            value: v,
                            text: food_value
                        });
                    }

                    if (i2 === array2.length - 1) {
                        compare.sort(function (a, b) {
                            return a.value - b.value;
                        });
                        const final_value = compare[compare.length - 1];
                        menu_count[final_value.text].data.push(1);
                    }
                });

                if (i === array.length - 1) {
                    let money_total = [];
                    let timeOut = null;
                    Object.keys(menu_count).forEach(function (key, i, array) {
                        const price = menu_count[key].price;
                        const total = menu_count[key].data.length;
                        if (total > 0) {
                            money_total.push(price * total);
                            final_list += `${key} - ${menu_count[key].data.length} phần` + "\n";
                        }

                        if (timeOut !== null) {
                            clearTimeout(timeOut);
                        }

                        timeOut = setTimeout(() => {
                            const total = money_total.reduce(function (sum, value) {
                                return sum + value;
                            }, 0);

                            final_list += "Tổng tiền phải trả : " + total + ".000 VND";
                            resetMenu();
                            botMethod.makeAnnounce(config.channel, 'Hoá đơn !!! <!channel>', final_list);
                            lunchOp.removeAll();

                        }, 2000);
                    });
                }

            });
        }
    }
    lunch_list.forEach(com_data);

}

function getAvailableDay() {
    let day_number = botMethod.getDay();
    if (day_number === 6 ||
        day_number === 7 ||
        day_number === 0 ||
        day_number === 5) {
        day_number = 1;
    } else {
        day_number += 1;
    }
    return day_number;
}

function pickDate() {
    const day_in_week = botMethod.getDayInWeek(getAvailableDay());
    return day_in_week;
}