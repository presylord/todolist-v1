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

const Item = mongoose.model("items", itemSchema);
const workItem = mongoose.model("workitems", itemSchema);

app.get("/", function (req, res) {
  var today = new Date();
  var options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  var completeDate = today.toLocaleDateString("en-US", options);

  Item.find({}, { item: 1, _id: 0 }, function (err, results) {
    //   if (results.length === 0) {
    //     Item.insertMany(defaultItems, function (err) {
    //       if (err) {
    //         console.log(err);
    //       } else {
    //         console.log("Added succesfully.");
    //       }
    //     });
    //     res.redirect("/");
    //   } else {
    //   }
    // });
    res.render("list", {
      listTitle: completeDate,
      items: results,
    });
    if (err) {
      console.log(err);
    }
  });
});

app.get("/work", function (req, res) {
  workItem.find({}, { item: 1, _id: 0 }, function (err, workItems) {
    res.render("list", { listTitle: "Work List", items: workItems });
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
