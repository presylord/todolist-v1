const express = require("express");
const app = express();
var items = ["go to gas station", "pay bills", "buy grocery"];
var newItem = "";

var workItems = ["create weekly report", "submit daily updates"];
var newWorkItem = "";

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  var today = new Date();
  var options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  var completeDate = today.toLocaleDateString("en-US", options);
  res.render("list", {
    listTitle: completeDate,
    items: items,
  });
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", items: workItems });
});

app.post("/", function (req, res) {
  if (req.body.list === "Work List") {
    var newWorkItem = req.body.newItem;
    workItems.push(newWorkItem);
    res.redirect("/work");
  } else {
    var newItem = req.body.newItem;
    items.push(newItem);
    res.redirect("/");
  }
});

app.post("/reset", function (req, res) {
  items = [];
  workItems = [];
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
