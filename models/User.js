require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  likedSongs: {
    type: Array
  },
  createdOn: {
    type: Date,
    default: () => Date.now(),
  },
});

// Static signup method
userSchema.statics.signup = async function(username, password) {
  if (!password || !username) {
    throw Error("All fields required!");
  }

  const usernameExists = await this.exists({ username });

  if (usernameExists) {
    throw Error("Username already in use");
  }

  const saltValue = parseInt(process.env.SALT);
  const salt = await bcrypt.genSalt(saltValue);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ username, password: hash });

  return user;
};

// Static login method

userSchema.statics.login = async function(username, password) {
  if (!password || !username) {
    throw Error("All fields required!");
  }

  const user = await this.findOne({ username })

  if (!user) {
    throw Error('Username does not exist')
  }

  const passwordsMatch = await bcrypt.compare(password, user.password)

  if (!passwordsMatch) {
    throw Error('Invalid login credentials')
  }

  return user
};

module.exports = mongoose.model("User", userSchema);
