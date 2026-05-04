const express = require("express");
const router = express.Router();

const store = require("../store/responseStore");

router.get("/status/:id", (req, res) => {
  const data = store[req.params.id];

  if (data) {
    res.json({ status: "complete", data });
  } else {
    res.json({ status: "pending", data: null });
  }
});

module.exports = router;