const Comment = require("../models/comment");
const Post = require("../models/post");
const User = require("../models/user");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  console.log(req.userData);

  post
    .save()
    .then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a post failed!"
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
    creatorName: req.userData.fullname
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate post!"
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      // console.log(documents)
      return Post.countDocuments();
    })
    .then(count => {

      const creatorsIdArray = fetchedPosts.map((item) => item.creator);
      User.find({ _id: { $in: creatorsIdArray } }, {password: false})
      .then(user => {
        const _fetchedPostPlain= JSON.parse(JSON.stringify(fetchedPosts));
        const _users = JSON.parse(JSON.stringify(user));

        const _fetchedFinalPosts = _fetchedPostPlain.map((item) => {
          item.creator = _users.find((br) => br._id === item.creator);
          return item;
        });
        // console.log(_fetchedFinalPosts);
      });

      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
      console.log(posts);

    })
    // .catch(error => {
    //   res.status(500).json({
    //     message: "Fetching posts failed!"
    //   });
    // });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        Comment.find({ postPath: req.params.id }).then((comments) => {
          res.status(200).json({ post, comments });
        });
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching post failed!",
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting posts failed!"
      });
    });
};
