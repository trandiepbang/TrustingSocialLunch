const mongoose = require('mongoose');
const moment = require('moment');


mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const dataModel = new Schema({
    userid: String,
    food: String,
    name: String,
    date: {
        type: Date,
        default: Date.now
    },
});


function getDate() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    d.toISOString();
    return d;

}

module.exports = {
    mongoose,
    getDate,
    moment,
    dataModel
};