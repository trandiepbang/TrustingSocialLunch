let dataModel = null;

function save(data, callback) {
    const datamodel = new this.dataModel(data);
    const savePromise = datamodel.save();
    console.log("trigger save data");
    savePromise.then(callback);
}

function find(callback) {
    console.log("trigger search");
    this.dataModel.find({
        date: {
            $gte: new Date()
        }
    }, callback);
}


function deleteData() {

}


module.exports = function (dataModel) {
    if (dataModel === null) {
        return;
    }

    this.dataModel = dataModel;
    this.save = save;
    this.delete = deleteData;
    this.find = find;

    return this;
};