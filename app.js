const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  var today = new Date();
  if (today.getDay() === 6 || today.getDay() === 0) {
    res.write("It's a weekend");
  } else {
    res.write("It's a weekday");
  }
  res.send();
});

// app.post();

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
