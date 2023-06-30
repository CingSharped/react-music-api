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

  const user = await this.create({ username, password: hash, likedSongs: []});

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


// static add liked song method
userSchema.statics.addLikedSong = async function(username, likedSong) {
  const user = await this.findOne({ username })
  console.log(user['likedSongs'])
  if (!user) {
    throw Error(`User ${username} does not exist`)
  }

  if (user.likedSongs.includes(likedSong)) {
    throw Error(`Song "${likedSong}" already liked`)
  }

  user.likedSongs.push(likedSong);

  await user.save()

  return user['likedSongs']
}

// static remove liked song method
userSchema.statics.removeLikedSong = async function(username, song) {
  const user = await this.findOne({ username });
  console.log(user["likedSongs"]);
  if (!user) {
    throw Error(`User ${username} does not exist`);
  }

  if (user.likedSongs.includes(song)) {
    songsIndex = user.likedSongs.indexOf(song)
    user.likedSongs.splice(songsIndex, 1)
  } else {
    throw Error(`Song ${song} is not liked and so cannot be removed`)
  }

  await user.save();

  return user["likedSongs"];
}

module.exports = mongoose.model("User", userSchema);