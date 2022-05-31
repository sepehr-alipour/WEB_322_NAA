const fs = require("fs");

let posts;
let categories;

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    fs.readFile("./data/posts.json", "utf8", (err, data) => {
      if (err) reject("unable to read file");
      posts = JSON.parse(data);
      fs.readFile("./data/categories.json", "utf8", (err, data) => {
        if (err) reject("unable to read file");
        categories = JSON.parse(data);
        resolve();
      });
    });
  });
};
module.exports.getPublishedPosts = function () {
  return new Promise(function (resolve, reject) {
    if (posts.length == 0) reject("no results returned");
    resolve(posts);
  });
};
module.exports.getAllPosts = function () {
  return new Promise(function (resolve, reject) {
    let filteredPosts = posts.filter((post) => post.published);
    if (filteredPosts.length == 0) reject("no results returned");
    resolve(filteredPosts);
  });
};
module.exports.getCategories = function () {
  return new Promise(function (resolve, reject) {
    if (categories.length == 0) reject("no results returned");
    resolve(categories);
  });
};
