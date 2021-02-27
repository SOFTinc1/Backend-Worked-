const Post = require("../models/post");
const Comment = require("../models/comment");

exports.createComment = (req, res, next) => {
  const { content, postId } = req.body;
  console.log(req.body);
  const comment = new Comment({
    content,
    postPath: postId,
    creator: req.userData.userId,
  });
  console.log(comment);
  comment
    .save()
    .then((createdComment) => {
      console.log(createdComment);
      if (createdComment) {
        return res.status(201).json({
          message: "Comment added successfully"
        });
      }
    })
    // .catch((error) => {
    //   res.status(500).json({
    //     message: "Creating a comment failed!",
    //   });
    // });
};


exports.updateComment = (req, res, next) => {
  const comment = new Comment({
    _id: req.body.id,
    content: req.body.content,
    creator: req.userData.userId,
  });
  Comment.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    comment
  )
    .then((result) => {
      if (result.n > 0) {
        return res.status(200).json({ message: "Comment Update successful!" });
      }
      res.status(401).json({ message: "Not authorized!" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't udpate post!",
      });
    });
};

exports.deleteComment = (req, res, next) => {
  Comment.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      console.log(result);
      if (result.n > 0) {
        return res.status(200).json({ message: "Deletion successful!" });
      }
      res.status(401).json({ message: "Not authorized!" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Deleting posts failed!",
      });
    });
};
