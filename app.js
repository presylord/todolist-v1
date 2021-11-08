const express = require("express");
const app = express();
var entryArray = [];
var newEntry = "";
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  var today = new Date();
  var options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  var completeDate = today.toLocaleDateString("en-US", options);
  res.render("list", {
    currentDay: completeDate,
    entryArray: entryArray,
  });
});

app.post("/", function (req, res) {
  var newEntry = req.body.newItem;
  entryArray.push(newEntry);
  res.redirect("/");
});
// app.post("/reset", function (req, res) {
//   entryArray = [];
//   res.redirect("/");
// });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
