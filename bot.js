const Botkit = require('botkit');
const config = require('./config/config.js');
const func_ = require('./skill/function.js');
const template = require('./data/template.js');

const mongoose = func_.mongoose;

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
let user_list = ['U2ZPTV09M'];


controller.on('direct_mention', function (bot, message) {
    console.log(message);
    bot.reply(message, 'Only the person who used the slash command can see this.');
});


setTimeout(function () {
    bot.startRTM(function (err, bot, payload) {
        botMethod.buildUsername((isSuccess) => {
            startAsking();
        });
    });
}, 2000);




function startAsking() {
    botMethod.getMenu("monday", (menu_list) => {
        if (user_list.length < 1) {
            return;
        }

        user_list.forEach(function (user_id, i, array) {
            botMethod.send(user_id, menu_list, (userid, isAccept) => {
                console.log("call back " + isAccept);
                console.log(userid);
                clearTimeout(askAgainTimeOut);
                user_list.splice(user_list.indexOf(user_id), 1);
            });
        });
    });

    if (askAgainTimeOut === null) {
        setAskAgain();
    }
    if ( closeDealTimeout === null ) {
        setCloseDeal();
    }
}

function setAskAgain() {
    askAgainTimeOut = setTimeout(function () {
        startAsking();
    }, config.askAgainTimeOut);
}


function setCloseDeal() {
    let receipt_list = [];
    closeDealTimeout = setTimeout(function () {
        user_list = [];
        console.log("finished close deal ");
        lunchOp.find(func_.getDate(), function (error, data) {
            if (data !== null && data.length > 0) {
                console.log("#Start to build recepit");
                data.forEach(function (receipt_data, i, array) {
                    console.log(receipt_data)
                    receipt_list.push(template.generateReceipt(receipt_data));
                    if (i === array.length - 1) {
                        botMethod.makeAnnounce(config.channel, 'Menu mọi người muốn ăn today !!!', receipt_list);
                    }
                });
            }
        });

    }, config.closeDealTimeout);
}