const express = require('express');
const tagsRouter = express.Router();
const { getAllTags } = require('../db')

tagsRouter.get('/', async(req, res, next) => {
  try {
    const tags = await getAllTags();
    res.send({tags})
  } catch (error) {
    console.error(error);
    next(error)
  }
})
module.exports = tagsRouter;
