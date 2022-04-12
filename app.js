const express = require("express");
const rateLimit = require("express-rate-limit");
const PImage = require("pureimage");

const fs = require("fs");
const path = require("path");

const pixel_profile_pic = require("./pixel-profile-pic");

require("dotenv").config();

const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api", (req, res) => {
  const width = parseInt(req.query.width) || 20;
  const cell = parseInt(req.query.cell) || 7;
  const color = "#" + (req.query.color || "7fffd4");
  const seed = req.query.seed || "default";

  const img = pixel_profile_pic(width, cell, color, seed);

  const timestamp = Math.floor(Date.now() / 1000);

  //write to 'out.png'
  PImage.encodePNGToStream(
    img,
    fs.createWriteStream(path.join(__dirname, "images", timestamp + ".png"))
  )
    .then(() => {
      res.sendFile(
        timestamp + ".png",
        {
          root: path.join(__dirname, "images"),
        },
        (err) => {
          fs.unlinkSync(path.join(__dirname, "images", timestamp + ".png"));
        }
      );
    })
    .catch((e) => {
      console.log(e);
      res.send("Oops, something went wrong 💩");
    });
});

app.use("*", (req, res, next) => {
  res.send("Not found ⛔");
});

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: process.env.NODE_ENV === "production" ? 100 : false,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    const error = new Error("Too many requests");
    error.status = StatusCodes.TOO_MANY_REQUESTS;
    next(error);
  },
});
app.use(limiter); // limits all paths

app.listen(port, () => console.log(`Server started on port ${port}`));
