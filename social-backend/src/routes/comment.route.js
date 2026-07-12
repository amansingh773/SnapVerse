const express = require("express")
const { isLoggedIn } = require("../middlewares/isLoggedIn")
const { Post } = require("../models/post.model")
const router = express.Router()
const mongoose = require("mongoose")
const { Comment } = require("../models/comment.model")


router.post("/create-comment", isLoggedIn, async(req, res) => {
    try {
            const foundUser = req.user
            const { text, postId } = req.body

              if (!text?.trim()) {
                throw new Error("Comment text is required")
              }

              if (!postId) {
              throw new Error("Post id is required")
              } 

              const post = await Post.findById(postId)

              if (!post) {
              throw new Error("Post not found")
              }

              const newComment = await Comment.create({
              text,
              authorId: foundUser._id,
              postId
              })

              post.comments.push(newComment._id)
              await post.save()

              await newComment.populate("authorId", "username displayPicture firstName lastName")

              res.status(201).json({
              success: true,
              msg: "Comment added",
              data: newComment
              })
  

    } catch (error) {
        res.status(400).json({
            success: false,
            err: error.message
        })
    }
})

router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      throw new Error("Comment not found");
    }

    const post = await Post.findById(comment.postId);

    const isCommentOwner = comment.authorId.toString() === req.user._id.toString();

    const isPostOwner = post && post.authorId.toString() === req.user._id.toString();

    if (!isCommentOwner && !isPostOwner) 
    {
      throw new Error("You are not authorized to delete this comment");
    }

    await Post.findByIdAndUpdate(comment.postId, {
      $pull: {comments: comment._id},
    });

    await Comment.findByIdAndDelete(comment._id);

    res.status(200).json({
      success: true,
      msg: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      err: error.message,
    });
  }
});

router.patch("/like/:id", isLoggedIn, async (req, res) => {
  try {
    const commentId = req.params.id
    const userId = req.user._id

    const comment = await Comment.findById(commentId)

    if (!comment) {
      throw new Error("Comment not found")
    }

    const alreadyLiked = comment.likes.some((id) => id.toString() == userId.toString()
    )

    if (alreadyLiked) {
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId.toString()
      )
    } else {
      comment.likes.push(userId)
    }

    await comment.save()

    res.status(200).json({
      msg: alreadyLiked ? "Comment unliked" : "Comment liked"
    })
  } catch (error) {
    res.status(400).json({
      err: error.message,
    })
  }
})


module.exports = {
    commentRouter: router
}