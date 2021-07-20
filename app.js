//jshint esversion:6

const express = require("express");

const mongoose = require("mongoose");
const app = express();
const lodash = require("lodash");

app.set('view engine', 'ejs');


app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-chavi:Test123@cluster0.4syqf.mongodb.net/todolistDB", {useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify: false });
const itemSchema = mongoose.Schema({
    name : String
});

const item = mongoose.model("Item",itemSchema);
const Welcome_list = new item({
  name: "Welcome to your to-dolist"
});
const hit = new item({
  name: "Hit + to add new items to the list "
});
const deleting_item = new item({
  name: "Check the box to delete an item"
});
const listSchema = mongoose.Schema({
  name: String,
  items:[itemSchema]
});

const list = mongoose.model("List",listSchema);




const additems = [Welcome_list,hit,deleting_item];

//to add items in mongo

app.get("/", function(req, res) {

  item.find(function(err,name){
    if(name.length === 0){
      item.insertMany(additems,function(err){
        if(err)
          console.log(err);
        else
          console.log("Sucessfully added");  
      });
      res.redirect("/");
    }
    else{
      res.render("list", {listTitle: "Today", newListItems: name});
    }
    
  });

  

});

app.post("/", function(req, res){

  const itemname = req.body.newItem;
  const listname = req.body.submitlist;
  const newitem = new item({
    name : itemname
  });
  
  if(listname == "Today"){
    newitem.save();
    res.redirect("/");
  }
  else{
    list.findOne({name:listname},function(err,foundlist){
      foundlist.items.push(newitem);
      foundlist.save();
      res.redirect("/"+ listname);
    });
  }

});

app.post("/delete",function(req,res){
  const checked = req.body.checkbox;
  const listname = req.body.listname;
  if(listname == "Today"){
    item.deleteOne({_id:checked},function(err){
      console.log("Deleted");
      res.redirect("/");
    });
  } else{
    list.findOneAndUpdate({name: listname}, {$pull:{items:{_id:checked}}}, function(err,foundlist){
      res.redirect("/"+listname);
    });
  }

});

app.get("/:parameter", function(req,res){
  let containslist = false;
  const pagename = lodash.capitalize(req.params.parameter);
  list.findOne({name:pagename},function(err,foundlist){
    if(err){
      console.log(err);
    }
    if(!foundlist){
      const newitem = new list({
        name: pagename,
        items: additems
      });
      newitem.save();
      res.redirect("/"+ pagename);
    }
    else{
      res.render("list", {listTitle: foundlist.name, newListItems: foundlist.items});
    }
  })
  
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
