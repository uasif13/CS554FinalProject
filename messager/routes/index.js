const message = require("./message");

const contructorMethod = (app) => {
  app.use("/api/sendMessage", message);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Page not found" });
  });
};

module.exports = contructorMethod;
