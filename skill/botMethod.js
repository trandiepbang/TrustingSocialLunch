let bot = null;
let lunchOp = null;

const template = require('../data/template.js');
const com_trua = require('../data/comtrua.js');

function getListUsers(mustOnline = false, callback) {
    let online_user = [];

    this.bot.api.users.list({}, function (err, response) {
        console.log(response)
        if (response.ok) {
            if (response.members !== null && response.members.length > 0) {
                response.members.forEach(function (user_data, i, array) {
                    if (user_data !== null && !user_data.is_bot && !user_data.deleted) {
                        this.bot.api.users.getPresence({
                            user: user_data.id
                        }, function (err, userIsOnline) {
                            if (userIsOnline !== null) {
                                const {
                                    presence
                                } = userIsOnline;
                                if (mustOnline && presence === 'active') {
                                    online_user.push(user_data);
                                } else {
                                    online_user.push(user_data);
                                }
                            }
                            if (i === array.length - 1) {
                                if (typeof callback !== 'undefined') {
                                    callback(online_user);
                                }
                            }
                        });
                    }
                });
            }
        }
    });
}

function getMenu(date, callback) {
    const lunch_list = com_trua.com.monday;
    let food_list = [];

    function com_data(com_data, i, array) {
        food_list.push(template.generate(com_data))
        if (i === array.length - 1) {
            callback(food_list);
        }
    }

    lunch_list.forEach(com_data);
}

function send(user_id, send_data, _callback) {
    const botMethod = this.bot;
    const lunchOp = this.lunchOp;

    botMethod.startPrivateConversation({
        user: user_id
    }, function (err, convo) {
        if (!err && convo) {
            convo.addQuestion('Bạn có ăn cơm không ? ', [{
                pattern: botMethod.utterances.yes,
                callback: function (response, convo) {
                    // this.bot.reply(response,send_data);
                    console.log(response);
                    // convo.say("asdasd",send_data)
                    botMethod.reply(response, send_data);

                    convo.addQuestion('Bạn muốn ăn gì ? ', [{
                        pattern: /.*/,
                        callback: function (response, convo) {
                            console.log(response);
                            lunchOp.save({
                                userid:response.id,
                                food:response.text
                            });
                            convo.say("Cám ơn rất nhiều");
                            convo.next();
                            
                            _callback(user_id, true);
                        }
                    }]);
                    convo.next();
                }
            }, {
                pattern: botMethod.utterances.no,
                callback: function (response, convo) {
                    // this.bot.reply(response,send_data);
                    convo.say("zxczxc", send_data)
                    convo.next();
                }
            }, ]);
        }
    });
}

module.exports = function (bot,lunchOp) {
    if (bot === null || lunchOp === null) {
        console.log("something is null");
        return;
    }
    this.bot = bot;
    this.lunchOp = lunchOp;

    this.getListUsers = getListUsers;
    this.getMenu = getMenu;
    this.send = send;

    return this;
};