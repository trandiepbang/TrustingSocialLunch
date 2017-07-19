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
const botMethod = require('./skill/botMethod.js')(bot);
const lunchOp = require('./skill/lunchOp.js')(DataModel);


controller.on('direct_mention', function (bot, message) {
    console.log(message);
    bot.reply(message, 'Only the person who used the slash command can see this.');
});
controller.on('direct_message', function (bot, message) {
    lunchOp.save({userid:"asdasd",food:"asdasd",name:"asdasd"});
    lunchOp.find();
});

setTimeout(function () {
    bot.startRTM(function (err, bot, payload) {
        if (err) {
            throw err;
        }
    });
}, 2000);

// botMethod.getMenu("monday", (menu_list) => {
//     const menu = {
//         attachments: menu_list
//     };
//     console.log(botMethod.send('U2ZPTV09M', menu));
//     botMethod.getListUsers(true, (online_list_user) => {
//         online_list_user.forEach(function (user_data, i, array) {
//             // const id = user_data.id; 
//             console.log(user_data); 
//             // botMethod.reply(id, menu)
//             // console.log(id);   
//         });
//     });
// });