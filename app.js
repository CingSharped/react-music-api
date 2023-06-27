const express = require("express");
const cors = require("cors");
const logger = require("morgan");

const app = express();

const userRoutes = require('./routers/users')

app.use(cors());
app.use(express.json());
app.use(logger("dev"));

// Root Route
app.get('/', (req, res) => {
  res.send(
    "<h1>Welcome to the Music-API</h1><p>This API is for the music app project by CingSharped and can be found <a href='https://github.com/CingSharped/react-music'>here<a/></p>"
  );
})

// User Routes
app.use('/users', userRoutes)




module.exports = app