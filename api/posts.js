const express = require('express');
const postsRouter = express.Router();
const { getAllPosts } = require('../db');

postsRouter.use( async (req, res, next) => {
  console.log("A request is being made to /posts");
  next();
});

postsRouter.get('/', async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    res.send({
      posts
    })
  } catch (err) {
    console.error(err);
    next(err);
  }

})

module.exports = postsRouter;
