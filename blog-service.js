const Sequelize = require("sequelize");
var sequelize = new Sequelize(
  "d5iha5hi4vised",
  "emfwojcxtksqtn",
  "3ef3f283cfb72da4bd967f491bf9f45b4a32efc803a2cecb9bd8f40124b9abf4",
  {
    host: "ec2-3-222-74-92.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

var Post = sequelize.define("Post", {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.BOOLEAN,
  published: Sequelize.BOOLEAN,
});
var Category = sequelize.define("Category", {
  category: Sequelize.STRING,
});

Post.belongsTo(Category, {foreignKey: 'category'});
module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    /*fs.readFile("./data/posts.json", "utf8", (err, data) => {
      if (err) reject("unable to read file");
      posts = JSON.parse(data);
      fs.readFile("./data/categories.json", "utf8", (err, data) => {
        if (err) reject("unable to read file");
        categories = JSON.parse(data);
        resolve();
      });
    });*/
    reject();
  });
};
module.exports.getAllPosts = function () {
  return new Promise(function (resolve, reject) {
    // if (posts.length == 0) reject("no results returned");
    // resolve(posts);
    reject();
  });
};
module.exports.getPublishedPosts = function () {
  return new Promise(function (resolve, reject) {
    // let filteredPosts = posts.filter((post) => post.published);
    // if (filteredPosts.length == 0) reject("no results returned");
    // resolve(filteredPosts);
    reject();
  });
};
module.exports.getCategories = function () {
  return new Promise(function (resolve, reject) {
    // if (categories.length == 0) reject("no results returned");
    // resolve(categories);
    reject();
  });
};
module.exports.addPost = function (post) {
  return new Promise(function (resolve, reject) {
    // post.published ? (post.published = true) : (post.published = false);
    // post.id = posts.length + 1;
    // var date = new Date();
    // var day = date.getDate();
    // var month = date.getMonth() + 1;
    // var year = date.getFullYear();
    // post.postDate = year + "-" + month + "-" + day;
    // posts.push(post);
    // resolve(post);
    reject();
  });
};
module.exports.getPostsByCategory = function (category) {
  return new Promise(function (resolve, reject) {
    // let filteredPosts = posts.filter((post) => post.category == category);
    // if (filteredPosts.length == 0) reject("no results returned");
    // resolve(filteredPosts);
    reject();
  });
};
module.exports.getPostsByMinDate = function (minDateStr) {
  return new Promise(function (resolve, reject) {
    // let filteredPosts = posts.filter(
    //   (post) => new Date(post.postDate) >= new Date(minDateStr)
    // );
    // if (filteredPosts.length == 0) reject("no results returned");
    // resolve(filteredPosts);
    reject();
  });
};

module.exports.getPostById = function (id) {
  return new Promise(function (resolve, reject) {
    // let filteredPosts = posts.find((post) => post.id == id);
    // if (!filteredPosts) reject("no results returned");
    // resolve(filteredPosts);
    reject();
  });
};

module.exports.getPublishedPostsByCategory = function (category) {
  return new Promise(function (resolve, reject) {
    // let filteredPosts = posts.filter(
    //   (post) => post.published == true && post.category == category
    // );
    // if (filteredPosts.length == 0) reject("no results returned");
    // resolve(filteredPosts);
    reject();
  });
};
