const Botkit = require('botkit');
const config = require('./config/config.js');
const func_ = require('./skill/function.js');
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
        console.log(err);
        startAsking();
    });
}, 2000);

function startAsking() {
    botMethod.getMenu("monday", (menu_list) => {
        const menu = {
            attachments: menu_list
        };
        botMethod.send('U2ZPTV09M', menu, (userid, isAccept) => {
            console.log("call back");
            if (isAccept) {
                // user_list
                user_list.splice(user_list.indexOf('U2ZPTV09M'), 1);
                console.log(userid);
            } else {

            }
        });

        if (askAgainTimeOut == null) {
            setAskAgain();
        } else {
            setCloseDeal();
        }
    });
}

function setAskAgain() {
    askAgainTimeOut = setTimeout(function () {
        startAsking();
    }, config.askAgainTimeOut);
}

function setCloseDeal() {
    closeDealTimeout = setTimeout(function () {
        user_list = [];
        console.log("finished close deal ");
        botMethod.find(function(error,data){
            console.log(data);
        });

    }, config.closeDealTimeout);
}