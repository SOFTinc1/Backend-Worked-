const path = require("path");
const express = require("express");

const ConnectDB = require("./database/db");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const commentRoutes = require("./routes/comment");

const app = express();

let cors = require('cors')
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

ConnectDB()


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});


app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/comment", commentRoutes);

module.exports = app;

