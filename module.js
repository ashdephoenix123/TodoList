require('dotenv').config()

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Item = mongoose.model('Item', itemSchema);

const item1 = new Item({
    name: "Welcome to your Todo list"
})
const item2 = new Item({
    name: "Add items on the go"
})
const item3 = new Item({
    name: "<--- Check an item"
})

const arr = [item1, item2, item3];



const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
})

const List = mongoose.model('List', listSchema);

module.exports={Item, arr, List}