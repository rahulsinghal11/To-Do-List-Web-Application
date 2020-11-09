//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');

const app = express();
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const itemsSchema = new mongoose.Schema({
  name: String      
});
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Buy Food" 
});
const item2 = new Item({
  name: "Cook Food" 
});
const item3 = new Item({
  name: "Eat Food" 
});

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {
  Item.find({}, function(err, items){
  if (items.length === 0){
    Item.insertMany(defaultItems, function(err){
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully inserted items");
    }  
    });
    res.redirect("/");
  }
  if (err) {
    console.log(err);
  } else {         
      res.render("list", {listTitle: "Today", newListItems: items});
    }
  
});  

});

app.post("/", function(req, res){
  const itemName = req.body.newItem;  
  const item = new Item({
  name: itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function(err, item){
    if (err) {
      console.log(err);
    } else {
      console.log("item removed");
      res.redirect("/");
    }
  })
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
