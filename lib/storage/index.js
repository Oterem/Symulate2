const storage = require('config').storage || "mongo";
const {init,getItemById,AddItemById,removeItemById} = require(`./${storage}`);

module.exports = {
    init,
    getItemById,
    AddItemById,
    removeItemById
}
