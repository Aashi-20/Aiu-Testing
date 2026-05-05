const express = require("express");
const router = express.Router();

const store = require("../store/responseStore");

router.post("/on-seek", (req, res) => {
  console.log("🔥 Webhook received:", JSON.stringify(req.body, null, 2));

  const correlationId = req.body.message.correlation_id;

  store[correlationId] = req.body;

  res.send({ status: "received" });
});



// 🔥 LOCAL TEST ON-SEEK (manual testing)
router.post("/local-on-seek", (req, res) => {
  console.log("🧪 LOCAL ON-SEEK received:", JSON.stringify(req.body, null, 2));

  const correlationId = req.body.message?.correlation_id;

  if (!correlationId) {
    return res.status(400).json({
      error: "correlation_id missing",
    });
  }

  store[correlationId] = req.body;

  res.json({
    status: "stored locally",
    correlation_id: correlationId,
  });
});



module.exports = router;