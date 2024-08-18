require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dns = require("dns");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

const postMiddleware = bodyParser.urlencoded({ extended: false });

app.use(cors());
app.use(postMiddleware);

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/shorturl/:shortUrl?", (req, res) => {
  console.log(`shortUrl => ${req.params.shortUrl}`);
  let originalUrl = urls.get(req.params.shortUrl);
  res.redirect(originalUrl);
});

app.post("/api/shorturl", (req, res) => {
  // let host = getHost(req.body.url);
  let host = new URL(req.body.url).hostname;
  dns.lookup(host, (err) => {
    if (err) {
      res.json({ error: "invalid url" });
    } else {
      let shortUrl = cacheShortUrl(req.body.url);
      res.json({
        original_url: req.body.url,
        short_url: shortUrl,
      });
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

// URL Map
let urls = new Map();
let shortUrlIndex = 1000;

function cacheShortUrl(url) {
  urls.set(`${++shortUrlIndex}`, url);
  return shortUrlIndex;
}
