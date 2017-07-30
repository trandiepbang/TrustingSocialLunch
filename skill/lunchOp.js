let dataModel = null;

function save(data, callback) {
    const datamodel = new this.dataModel(data);
    const savePromise = datamodel.save();
    console.log("trigger save data");
    savePromise.then(callback);
}

function removeAll() {
    return this.dataModel.remove({}, function () {

    });
}


function find(date_time, callback) {
    const op = date_time === null ? {} : {
        date: {
            $gte: date_time
        }
    };
    console.log("op ", op);
    this.dataModel.find(op, callback);
}

module.exports = function (dataModel) {
    if (dataModel === null) {
        return;
    }

    this.dataModel = dataModel;
    this.save = save;
    this.find = find;
    this.removeAll = removeAll;

    return this;
};