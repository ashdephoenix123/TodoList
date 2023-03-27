const express = require('express')
const bodyParser = require('body-parser')
const {Item, arr, List} = require(__dirname + "/module");

const app = express();
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');


app.route("/")
    .get((req, res) => {
        Item.find({}, (err, foundItems) => {
            if (err) {
                console.log(err);
            } else {
                if (foundItems.length === 0) {
                    Item.insertMany(arr, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    res.redirect("/");
                } else {
                    res.render("index", { title: "Today", newItem: foundItems })
                }
            }
        })
    })
    .post((req, res) => {
        const listName = req.body.list;
        const addCustomItem = req.body.newTodo;
        const item = new Item({
            name: addCustomItem
        });
        if (listName === "Today") {
            item.save();
            res.redirect("/")
        } else {
            List.findOne({ name: listName }, (err, foundList) => {
                if (err) {
                    console.log(err);
                } else {
                    foundList.items.push(item);
                    foundList.save();
                    res.redirect(`/${foundList.name}`)
                }
            })
        }
    });

app.route("/:customTitle")
    .get((req, res) => {
        const customTitle = req.params.customTitle;
        List.findOne({ name: customTitle }, (err, foundList) => {
            if (err) {
                console.log(err);
            } else {
                if (!foundList) {
                    const list = new List({
                        name: customTitle,
                        items: arr
                    });
                    list.save();
                    res.redirect(`/${customTitle}`)
                } else {
                    
                    res.render("index", { title: foundList.name, newItem: foundList.items })
                }
            }
        })
    });

app.route("/delete")
    .post((req, res) => {
        const id = req.body.checkbox;
        const listName = req.body.titleName;

        if (listName === "Today") {
            Item.findByIdAndRemove(id, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/");
                }
            })
        } else {
           List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: id}}}, (err, result)=> {
            if(err){
                console.log(err);
            } else {
                res.redirect(`/${listName}`);
            }  
           })
        }
    });
app.listen(3000, () => {
    console.log("server is up and ready in port http://localhost:3000");
});