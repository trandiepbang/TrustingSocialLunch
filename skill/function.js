const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;
const dataModel = new Schema({
    userid: String,
    food:String,
    name: String,
    date: { type: Date, default: Date.now },
});

module.exports = {
    mongoose,
    dataModel
};