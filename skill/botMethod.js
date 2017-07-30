let bot = null;
let lunchOp = null;
let userName = {};

const template = require('../data/template.js');
const com_trua = require('../data/comtrua.js');
const config = require('../config/config.js');
const func_ = require('./function.js');
const removeDau = func_.removeDiacritics;
const natural = func_.natural;


function getLunchListData(date) {
    return com_trua.com[date];
}

function channelUsersList(callback) {
    let members_list = [];
    this.bot.api.channels.list({}, (err, response) => {
        const rep = response;
        if (rep.ok) {
            rep.channels.forEach((channel_data, index, array) => {
                const channel_id = channel_data.id;
                if (channel_id === config.channel) {
                    members_list = channel_data.members;
                }

                if (index === array.length - 1) {
                    callback(members_list);
                }
            });
        }
    });
}

function getListUsers(mustOnline = false, callback) {
    let online_user = [];

    this.bot.api.users.list({}, function (err, response) {
        // console.log(response)
        if (response.ok) {
            if (response.members !== null && response.members.length > 0) {
                response.members.forEach(function (user_data, i, array) {
                    if (user_data !== null && !user_data.is_bot && !user_data.deleted) {

                        online_user.push(user_data);

                        if (i === array.length - 1) {
                            if (typeof callback !== 'undefined') {
                                setTimeout(() => {
                                    callback(online_user);
                                }, 5000);
                            }
                        }
                    }
                });
            } else {
                if (typeof callback !== 'undefined') {
                    callback(online_user);
                }
            }
        }
    });
}

function getMenu(date, callback) {
    const lunch_list = getLunchListData(date);
    let food_list = [];
    function com_data(com_data, i, array) {
        console.log(com_data);
        
        com_data.index = i;
        food_list.push(template.generate(com_data));

        if (i === array.length - 1) {
            callback(food_list);
        }
    }

    lunch_list.forEach(com_data);
}

function send(user_id, pickDate, send_data, _callback) {
    const botMethod = this.bot;
    const lunchOp = this.lunchOp;
    console.log("pick data trong send ", pickDate);

    botMethod.startPrivateConversation({
        user: user_id
    }, function (err, convo) {
        if (!err && convo) {
            convo.addQuestion(`Bạn có muốn đặt cơm trưa cho ${DayNameInVn(pickDate)} không? `, [{
                pattern: /(yes|okay|ok|um|coá|có|yess|yeess|ừm|uh|co).*/gi,
                callback: function (response, convo) {
                    console.log(response);
                    send_data.push("Nhập #huy sẽ huỷ");
                    convo.addQuestion('Đây là menu cho bữa sau . Bạn muốn ăn gì ? \r\n ' + send_data.join('\r\n'), [{
                        pattern: /.*/gi,
                        callback: function (response, convo) {
                            // console.log(response);
                            let value = response.text;
                            if (value === config.cancel) {
                                convo.say("Cảm ơn bạn");
                                convo.next();
                                _callback(user_id, true);
                                return;
                            }
                            if (!isNaN(value)) {
                                value = parseInt(value);
                                if (value < send_data.length) {
                                    lunchOp.save({
                                        userid: response.user,
                                        name: getUsername(response.user),
                                        food: send_data[value]
                                    });
                                    convo.say(`Bạn đã chọn ${send_data[value]} xong, cảm ơn bạn`);
                                    convo.next();
                                    _callback(user_id, true);
                                } else {
                                    convo.say("Number menu bạn chọn không tồn tại");
                                    convo.repeat();
                                    convo.next();
                                }
                            } else {
                                let food_guess_list = [];

                                for (let i = 0; i < send_data.length; i++) {
                                    const food_list_value = send_data[i];
                                    console.log("#loop value ", food_list_value);
                                    //
                                    const value_a = removeDau(response.text);
                                    const value_b = removeDau(food_list_value);
                                    //
                                    const distance = natural.JaroWinklerDistance(value_a, value_b);
                                    food_guess_list.push({
                                        v: distance,
                                        name: food_list_value
                                    });
                                    if (i >= send_data.length - 1) {
                                        console.log("#loop final");
                                        food_guess_list.sort(function (a, b) {
                                            return a.v - b.v;
                                        });

                                        const final_value = food_guess_list[food_guess_list.length - 1];
                                        console.log("#final value", final_value);
                                        const final_distance = final_value.v;
                                        console.log("distance value ", final_distance);

                                        if (final_distance >= 0.7) {
                                            lunchOp.save({
                                                userid: response.user,
                                                name: getUsername(response.user),
                                                food: response.text
                                            });
                                            convo.say(`Bạn đã chọn ${response.text} xong, cảm ơn bạn`);
                                            convo.next();
                                            _callback(user_id, true);
                                        } else {
                                            const notExist_test = /(không|kô|ko|ko co|kô|no|nope|nopes|kô|khong an|khong).*/gi;
                                            if (notExist_test.test(response.text)) {
                                                convo.say("Cảm ơn bạn");
                                                convo.next();
                                                _callback(user_id, true);
                                            } else {
                                                console.log("not exist");
                                                convo.say("Number menu bạn chọn không tồn tại");
                                                convo.repeat();
                                                convo.next();
                                            }
                                        }
                                    }
                                }

                            }
                        }
                    }]);
                    convo.next();
                }
            }, {
                pattern: /(không|kô|ko|ko co|kô|no|nope|nopes|kô|khong an|khong).*/gi,
                callback: function (response, convo) {
                    // this.bot.reply(response,send_data);
                    convo.say("Okie vậy hoy , cảm ơn bạn");
                    convo.next();
                    _callback(user_id, false);
                }
            }, ]);
        }
    });
}

function makeAnnounce(channel_id, text, attachments) {
    this.bot.say({
        text: text + "\n" + attachments,
        // attachments: attachments,
        channel: channel_id
    });
}


function buildUsername(callback) {
    getListUsers(true, (list_user) => {
        console.log("#list user", list_user.length)
        list_user.forEach(function (user_data, i, array) {
            userName[user_data.id] = user_data.real_name || user_data.name;
            if (i === array.length - 1) {
                console.log("#Init : build username success");
                // console.log(userName)
                callback(true);
            }
        });
    });
}

function getUsername(id) {
    if (userName === null || typeof userName[id] === 'undefined') {
        return null;
    } else {
        return userName[id];
    }
}


function getDay() {
    return new Date().getDay();
}

function DayNameInVn(day) {
    var weekday = new Array(7);
    weekday[0] = "Chủ nhật";
    weekday[1] = "Thứ 2";
    weekday[2] = "Thứ 3";
    weekday[3] = "Thứ 4";
    weekday[4] = "Thứ 5";
    weekday[5] = "Thứ 6";
    weekday[6] = "Thứ 7";
    weekday[7] = "Chủ nhật";
    var n = weekday[day];
    return n;
}

function getDayInWeek(day) {
    var weekday = new Array(7);
    weekday[0] = "sunday";
    weekday[1] = "monday";
    weekday[2] = "tuesday";
    weekday[3] = "wednesday";
    weekday[4] = "thursday";
    weekday[5] = "friday";
    weekday[6] = "saturday";
    var n = weekday[day];
    return n;
}

module.exports = function (bot, lunchOp) {
    if (bot === null || lunchOp === null) {
        console.log("something is null");
        return;
    }
    this.bot = bot;
    this.lunchOp = lunchOp;

    this.getListUsers = getListUsers;
    this.getMenu = getMenu;
    this.send = send;
    this.makeAnnounce = makeAnnounce;
    this.channelUsersList = channelUsersList;
    this.buildUsername = buildUsername;
    this.getLunchListData = getLunchListData;
    this.getDay = getDay;
    this.getDayInWeek = getDayInWeek;

    return this;
};