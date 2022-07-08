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
module.exports.getAllPosts = function () {
  return new Promise(function (resolve, reject) {
    if (posts.length == 0) reject("no results returned");
    resolve(posts);
  });
};
module.exports.getPublishedPosts = function () {
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
module.exports.addPost = function (post) {
  return new Promise(function (resolve, reject) {
    post.published ? (post.published = true) : (post.published = false);
    post.id = posts.length + 1;
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    post.postDate = year + "-" + month + "-" + day;
    posts.push(post);
    resolve(post);
  });
};
module.exports.getPostsByCategory = function (category) {
  return new Promise(function (resolve, reject) {
    let filteredPosts = posts.filter((post) => post.category == category);
    if (filteredPosts.length == 0) reject("no results returned");
    resolve(filteredPosts);
  });
};
module.exports.getPostsByMinDate = function (minDateStr) {
  return new Promise(function (resolve, reject) {
    let filteredPosts = posts.filter(
      (post) => new Date(post.postDate) >= new Date(minDateStr)
    );
    if (filteredPosts.length == 0) reject("no results returned");
    resolve(filteredPosts);
  });
};

module.exports.getPostById = function (id) {
  return new Promise(function (resolve, reject) {
    let filteredPosts = posts.find((post) => post.id == id);
    if (!filteredPosts) reject("no results returned");
    resolve(filteredPosts);
  });
};

module.exports.getPublishedPostsByCategory = function (category) {
  return new Promise(function (resolve, reject) {
    let filteredPosts = posts.filter(
      (post) => post.published == true && post.category == category
    );
    if (filteredPosts.length == 0) reject("no results returned");
    resolve(filteredPosts);
  });
};
