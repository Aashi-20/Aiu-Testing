const express = require("express");
const router = express.Router();

const store = require("../store/responseStore");

router.post("/webhook", (req, res) => {
  console.log("🔥 Webhook received:", JSON.stringify(req.body, null, 2));

  const correlationId = req.body.message.correlation_id;

  store[correlationId] = req.body;

  res.send({ status: "received" });
});

module.exports = router;