var express = require("express");
var blog = require("./blog-service.js");

var app = express();
var PATH = require("path");
var PORT = process.env.PORT || 8080;

app.use(express.static("public"));

function onHttpStart() {
  console.log("Express http server listening on " + PORT);
}

app.get("/", function (req, res) {
  res.redirect("/about");
});
app.get("/about", function (req, res) {
  res.sendFile(PATH.join(__dirname, "/views/about.html"));
});
app.get("/blog", function (req, res) {
  blog
    .getAllPosts()
    .then((response) => {
      res.json(response);
    })
    .catch((rejectMessage) => {
      "message:" + rejectMessage;
    });
});

app.get("/posts", function (req, res) {
  blog
    .getPublishedPosts()
    .then((response) => {
      res.json(response);
    })
    .catch((rejectMessage) => {
      "message:" + rejectMessage;
    });
});

app.get("/categories", function (req, res) {
  blog
    .getCategories()
    .then((response) => {
      res.json(response);
    })
    .catch((rejectMessage) => {
      "message:" + rejectMessage;
    });
});

app.use((req, res) => {
  res.status(404).sendFile(PATH.join(__dirname, "/views/not_found.html"));
});

blog
  .initialize()
  .then(() => {
    app.listen(PORT, onHttpStart);
  })
  .catch((rejectMessage) => {
    console.log(rejectMessage);
  });
