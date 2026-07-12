const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
    },

    password: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 2,
      maxLength: 12,
      immutable: true,
    },

    firstName: {
      type: String,
      trim: true,
      minLength: 2,
    },

    lastName: {
      type: String,
      trim: true,
    },

    dateOfBirth: {
      type: String,
    },

    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },

    followers: [
      {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
      }
    ],

    following: [
      {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
      }
    ],

    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    displayPicture: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },

    isCompletedProfile: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
