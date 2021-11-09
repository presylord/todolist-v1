const express = require("express");
const app = express();
var items = ["go to gas station", "pay bills", "buy grocery"];
var newItem = "";
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
    currentDay: completeDate,
    items: items,
  });
});

app.post("/", function (req, res) {
  var newItem = req.body.newItem;
  items.push(newItem);
  res.redirect("/");
});
app.post("/reset", function (req, res) {
  items = [];
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
