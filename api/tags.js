const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db')

tagsRouter.get('/', async(req, res, next) => {
  try {
    const tags = await getAllTags();
    res.send({tags})
  } catch (error) {
    console.error(error);
    next(error)
  }
})

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  // read the tagname from the params
  const {tagName} = req.params;
  try {
    // use our method to get posts by tag name from the db
    const allPosts = await getPostsByTagName(tagName);
    // filter out any posts which are both inactive and not owned by the current user.
    const posts = allPosts.filter(post => post.active || (req.user && post.author.id === req.user.id));
    res.send({posts});
  } catch ({ name, message }) {
    // forward the name and message to the error handler
    next({name, message});
  }
});
module.exports = tagsRouter;
