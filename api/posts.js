const express = require('express');
const postsRouter = express.Router();
const { getAllPosts, createPost } = require('../db');

postsRouter.use( async (req, res, next) => {
  console.log("A request is being made to /posts");
  next();
});

const { requireUser } = require('./utils');

postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/)
  let postData = {};

  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    console.log('>>>>>>>>> req.body', req.body);
    const authorId = req.user.id
    const {title, content} = req.body;

    // add authorId, title, content to postData object
    postData = {
      ...postData,
      authorId,
      title,
      content
    };
    // this will create the post and the tags for us
    const post = await createPost(postData);
    // if the post comes back, res.send({ post });
    if (post) {
      res.send({post})
    } else {
      next({
        name: "FailedCreatePost",
        message: "Failed to create post"
      });
    }
    // otherwise, next an appropriate error object 

    res.send({message: 'under construction'})
  } catch ({ name, message }) {
    next({ name, message });
  }
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
