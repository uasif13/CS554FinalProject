const { request } = require("express");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  let dest = req.body.destination;
  let message = req.body.message;
  dest = "+1" + dest;

  console.log(dest, message);

  let plivo = require("plivo");

  let auth_id = "MAZJM2YTZKM2M0ZWI2ZG";
  let auth_token = "YjEzOGEyZmVhMDg4ZDEzNjZlMWU3OTVhNGFhZDdi";

  var client = new plivo.Client(auth_id, auth_token);
  client.messages
    .create("+19045607629", dest, message)
    .then(function (response) {
      console.log(response);
      return res.status(200).json({ message: "success!" });
    })
    .catch((e) => {
      console.log(e.message);
      return res.status(500).json({ error: e.message });
    });
});

module.exports = router;
