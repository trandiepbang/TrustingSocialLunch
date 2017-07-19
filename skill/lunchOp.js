let dataModel = null;

function save(data, callback) {
    const datamodel = new this.dataModel(data);
    const savePromise = datamodel.save();
    savePromise.then(callback);
}

function deleteData() {
    
}

function find() {
    console.log("trigger search");
    this.dataModel.find({}, function (err, docs) {
        // docs.forEach
        console.log(docs);
    });
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