const express = require("express");
const app = express();
const mongoose = require("mongoose");

// var items = ["go to gas station", "pay bills", "buy grocery"];
// var newItem = "";

// var workItems = ["create weekly report", "submit daily updates"];
// var newWorkItem = "";

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

app.get("/", function (req, res) {
  var today = new Date();
  var options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  var completeDate = today.toLocaleDateString("en-US", options);

  Item.find({}, function (err, results) {
    res.render("list", {
      listTitle: completeDate,
      items: results,
    });
    if (!err) {
      console.log("app.get OK!");
    }
  });
});

app.get("/:newList", function (req, res) {
  const newListName = req.params.newList;
  List.findOne({ name: newListName }, function (err, foundList) {
    if (!foundList) {
      console.log("Not found!, Creating...");
      const newList = new List({ name: newListName, items: [] });
      newList.save();
      res.redirect("/" + newListName);
    } else {
      console.log("List found!");
      res.render("list", { listTitle: foundList.name, items: foundList.item });
    }
  });
});

app.post("/", function (req, res) {
  if (req.body.list === "Work List") {
    var newWorkItem = new workItem({ item: req.body.newItem });
    newWorkItem.save();
    res.redirect("/work");
  } else {
    var newItem = new Item({ item: req.body.newItem });
    newItem.save();

    res.redirect("/");
  }
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

app.post("/delete", function (req, res) {
  const checkedItem = req.body.checkBox;
  console.log(checkedItem);
  Item.deleteOne({ _id: checkedItem }, function (err) {
    console.log(err);
    res.redirect("/");
  });
});

app.post("/reset", function (req, res) {
  Item.deleteMany(function (err) {
    console.log(err);
  });
  workItem.deleteMany(function (err) {
    console.log(err);
  });
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
