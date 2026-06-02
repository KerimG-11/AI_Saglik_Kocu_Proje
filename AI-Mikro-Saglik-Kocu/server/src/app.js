const path = require("path");
const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

const clientPublicPath = path.join(__dirname, "../../client/public");
app.use(express.static(clientPublicPath));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API endpoint bulunamadi." });
  }
  return res.sendFile(path.join(clientPublicPath, "index.html"));
});

module.exports = app;
