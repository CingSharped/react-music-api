const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// Login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const { _id } = await User.login(username.toLowerCase(), password);

    const token = createToken(_id);

    res.status(200).json({ _id , username, token });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// Signup User

const signupUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const { _id } = await User.signup(username.toLowerCase(), password);

    const token = createToken(_id);

    res.status(201).json({ _id, username, token });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = {
  signupUser,
  loginUser,
};
