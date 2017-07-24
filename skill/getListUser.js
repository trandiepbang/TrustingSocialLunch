let bot = null;
function getListUsers() {
    bot.api.users.list({}, function (err, response) {
        console.log(response)
        if (response.ok) {
            if (response.members !== null && response.members.length > 0) {
                response.members.forEach(function (user_data) {
                    if (user_data !== null && !user_data.is_bot && !user_data.deleted) {
                        console.log(user_data);
                    }
                });
            }
        }
    });
}

module.exports = function(bot) {
    if ( bot === null ) {
        return;
    }
    this.bot = bot;
    return this;
};


