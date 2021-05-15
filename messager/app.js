const express = require("express");
const app = express();
var cors = require("cors");
const configRoutes = require("./routes");

app.use(express.json());
app.use(cors());

configRoutes(app);
app.listen(8080, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:8080");
});
