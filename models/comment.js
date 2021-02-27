const mongoose = require("mongoose");


const commentSchema = mongoose.Schema({
  content: { type: String, required: true },
  postPath: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

const Comment = mongoose.model("Comment", commentSchema);
 module.exports = Comment;
