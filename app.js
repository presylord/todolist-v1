const express = require("express");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = {
  item: {
    type: String,
    required: true,
  },
};

const listSchema = {
  name: String,
  item: [itemSchema],
};

const Item = mongoose.model("items", itemSchema);
const List = mongoose.model("lists", listSchema);

var today = new Date();
var options = {
  weekday: "long",
  month: "long",
  day: "numeric",
};
var completeDate = today.toLocaleDateString("en-US", options);

app.get("/", function (req, res) {
  Item.find({}, function (err, results) {
    res.render("list", {
      listTitle: completeDate,
      items: results,
    });
    if (!err) {
    }
  });
});

app.get("/:newList", function (req, res) {
  const newListName = _.capitalize(req.params.newList);
  List.findOne({ name: newListName }, function (err, foundList) {
    if (!foundList) {
      console.log("Not found!, Creating...");
      const list = new List({ name: newListName, item: [] });
      list.save();
      res.redirect("/" + newListName);
    } else {
      res.render("list", { listTitle: foundList.name, items: foundList.item });
    }
  });
});

app.post("/", function (req, res) {
  var newItem = new Item({ item: req.body.newItem });
  var newList = req.body.list;

  if (newList == completeDate) {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({ name: newList }, function (err, foundList) {
      foundList.item.push(newItem);
      foundList.save();
      res.redirect("/" + newList);
    });
  }
});

// deleting individual item

app.post("/delete", function (req, res) {
  const checkedItem = req.body.checkBox;
  const listName = req.body.listName;
  console.log(checkedItem);
  if (listName == completeDate) {
    Item.deleteOne({ _id: checkedItem }, function (err) {
      console.log(err);
      res.redirect("/");
    });
  } else {
    //pulling an item within an array
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { item: { _id: checkedItem } } },
      function (err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        } else {
          console.log(err);
        }
      }
    );
  }
});

// deleting all items on the list

app.post("/reset", function (req, res) {
  Item.deleteMany(function (err) {
    console.log(err);
  });
  List.deleteMany(function (err) {
    console.log(err);
  });

  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
