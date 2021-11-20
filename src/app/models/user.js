const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email format");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    validate(value) {
      if (value.toLowerCase().includes("password"))
        throw new Error("Password must not contain the word 'password'");
    },
  },
  age: {
    type: Number,
    default: 18,
    validate(value) {
      if (value <= 0) throw new Error("Age can not be negative or 0");
      else if (value < 18)
        throw new Error("Sorry! age must be grater than or equal to 18");
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
});

/*
 *   User relationship with Task
 *   Through this relationship we will be able to get all the tasks created by a user.
 *   virtual is used because the tasks property does not exist in the user collection. It is created on demand.
 */
userSchema.virtual("tasks", {
  ref: "Task", // Task model
  localField: "_id",
  foreignField: "user_id",
});

// Mongoose middleware for password hashing.
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Mongoose middleware to delete tasks when a user is deleted.
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ user_id: user._id });
  next();
});

/*
 *
 *  User login method
 *
 *  1. First we try to get the user by the provided email.
 *     If there is no user with the email provided , we throw an error and stop the process.
 *  2. If thete is a user with the email provided, we then compare the password using
 *     bcrypt.compare() method.
 *
 */
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Unable to login.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Unable to login.");

  return user;
};

// Generating jwt auth token.
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Removing sensative data such as password, tokens from the user object
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject(); // Removes all the mongoose operations and return raw data back.
  
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
