const express = require("express");
const mongoose = require("mongoose");
const app = express();
const ShortUrl = require("./models/shorturl");

mongoose
  .connect("mongodb://localhost:27017/urlshortener", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to db"))
  .catch(() => console.log("Connection Failed"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
var PORT = process.env.PORT || 4000;
app.get("/", function (req, res) {
  ShortUrl.find({}, function (err, shortUrls) {
    if (err) {
      console.log(err);
    } else {
      console.log("HERE");
      console.log(shortUrls);
      res.render("index", { shortUrls: shortUrls });
    }
  });
});

app.post("/shorturl", function (req, res) {
  ShortUrl.create(
    {
      full: req.body.fullUrl,
    },
    function (err, newUrl) {
      if (err) {
        console.log(err);
      } else {
        console.log(" CREATING");
        console.log(newUrl);
        console.log("CREATED");
        res.redirect("/");
      }
    }
  );
});
app.get("/:shortUrl", function (req, res) {
  ShortUrl.findOne({ short: req.params.shortUrl }, function (err, shortUrl) {
    if (err) {
      console.log("HERE");
      console.log(err);
    }
    if (shortUrl == null) {
      res.sendStatus(404);
    }
    console.log(shortUrl);
    shortUrl.clicks++;
    shortUrl.save();
    res.redirect(shortUrl.full);
  });
});
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
