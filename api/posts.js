const express = require("express");
const { getAllPosts, createPost } = require("../db");
const { requireUser } = require('./utils');
const postsRouter = express.Router();

postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next();
});

postsRouter.get("/", async (req, res) => {
  const posts = await getAllPosts();

  res.send({
    posts,
  });
});

postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/)
  const postData = {
    authorId: req.user.id,
    title,
    content
  };
      // console.log(req);

  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    const post = await createPost(postData);
    res.send({
      post
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = postsRouter;
