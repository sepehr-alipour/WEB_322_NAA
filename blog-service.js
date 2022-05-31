const posts = require("./data/posts.json");
const categories = require("./data/categories.json");

module.exports.getBlog = function () {
  let filteredPosts = posts.filter((post) => post.published);
  return filteredPosts;
};
module.exports.getCategories = function () {
  return categories;
};
