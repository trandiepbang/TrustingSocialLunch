const Botkit = require('botkit');
const config = require('./config/config.js');
const func_ = require('./skill/function.js');
const template = require('./data/template.js');

const mongoose = func_.mongoose;
const later = func_.later;

const natural = func_.natural;

mongoose.connect('mongodb://localhost/ts_lunch');
const DataModel = mongoose.model('data-model', func_.dataModel);

const controller = Botkit.slackbot({});
const bot = controller.spawn({
    token: config.botToken
});
const lunchOp = require('./skill/lunchOp.js')(DataModel);
const botMethod = require('./skill/botMethod.js')(bot, lunchOp);

let askAgainTimeOut = null;
let closeDealTimeout = null;
let user_list = [];
let menu_count = {};
//Bang d

function resetMenu() {

    menu_count = {};
    user_list = [];
    askAgainTimeOut = null;
    closeDealTimeout = null;

}

controller.on('direct_mention', function (bot, message) {
    console.log(message);
    bot.reply(message, 'Start demo testing');

    user_list = [];
    closeDealTimeout = null;
    askAgainTimeOut = null;

    buildingUserList();
});
//
setTimeout(function () {
    bot.startRTM(function (err, bot, payload) {
        const time = 'at 5:00pm on Monday,Tuesday,Wednesday,Thursday,Friday,Sunday';
        const t = later.parse.text(time);
        later.setInterval(function () {
            if (botMethod.getDay() === 0 || botMethod.getDay() === 7) {
                config.closeDealTimeout = '57600000';
                config.setAskAgain = '54000000';
            } else {
                config.closeDealTimeout = '1800000';
                config.setAskAgain = '900000';
            }
            start();
        }, t);
    });
}, 2000);

function start() {
    botMethod.channelUsersList((users_id_list) => {
        if (users_id_list !== null &&
            users_id_list.length > 0) {
            user_list = users_id_list;
            buildingUserList();

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
    let day_number = botMethod.getDay();
    if (day_number === 6 || day_number === 7 || day_number === 0) {
        day_number = 1;
    } else {
        day_number += 1; 
    }

    const day_in_week = botMethod.getDayInWeek(day_number);
    botMethod.getMenu(day_in_week, (menu_list) => {
        if (user_list.length < 1) {
            return;
        }
        //bang
        user_list.forEach(function (user_id, i, array) {
            botMethod.send(user_id, menu_list, (userid, isAccept) => {
                console.log("call back " + isAccept);
                console.log(userid); 
                user_list.splice(user_list.indexOf(user_id), 1);
                console.log("Current user left ", user_list);
            });
        });
    });

    if (askAgainTimeOut === null) {
        setAskAgain();
    }
    if (closeDealTimeout === null) {
        setCloseDeal();
    }
}

function setAskAgain() {
    askAgainTimeOut = setTimeout(function () {
        startAsking();
    }, config.askAgainTimeOut);
}


function setCloseDeal() {
    // let receipt_list = [];
    let receipt_list = "";
    let recepit_food_list = [];

    closeDealTimeout = setTimeout(function () {
        user_list = [];
        console.log("finished close deal ");
        lunchOp.find(func_.getDate(), function (error, data) {
            if (data !== null && data.length > 0) {
                console.log("#Start to build recepit");
                data.forEach(function (receipt_data, i, array) {
                    console.log(receipt_data)
                    receipt_list += template.generateReceipt(receipt_data) + "\n";
                    recepit_food_list.push(receipt_data);
                    // receipt_list.push(template.generateReceipt(receipt_data));
                    if (i === array.length - 1) {
                        SummarizeTotal(recepit_food_list);
                        botMethod.makeAnnounce(config.channel, 'Menu mọi người muốn ăn today !!!', receipt_list);
                    }
                });
            }
        });

    }, config.closeDealTimeout);
}

function SummarizeTotal(list_data) {
    const lunch_list = botMethod.getLunchListData();
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
                    const v = natural.JaroWinklerDistance(food_picked.food, food_value);
                    compare.push({
                        value: v,
                        text: food_value
                    });
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
                            final_list += `${key} - ${menu_count[key].data.length} phan ` + "\n";
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
                            botMethod.makeAnnounce(config.channel, 'Hoá đơn !!!', final_list);

                        }, 2000);
                    });
                }

            });
        }
    }
    lunch_list.forEach(com_data);

}