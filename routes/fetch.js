// const express = require("express");
// const router = express.Router();

// const { getToken } = require("../services/tokenService");
// const { callSeek } = require("../services/seekService");

// router.post("/fetch-farmer", async (req, res) => {
//   try {
//     const token = await getToken();

//     const callbackUrl =
//       "https://virtual-scheming-exclaim.ngrok-free.dev/webhook";

//     const response = await callSeek(token, callbackUrl);

//     res.json({
//       correlation_id: response.message.correlation_id,
//       status: "processing",
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch farmer data" });
//   }
// });

// module.exports = router;




const express = require("express");
const router = express.Router();

const { getToken } = require("../services/tokenService");
const { callSeek } = require("../services/seekService");

router.post("/fetch-farmer", async (req, res) => {
  try {
    // 🔷 Get data from UI / request body
    const { aadhaar, state } = req.body;

    // Basic validation
    if (!aadhaar || !state) {
      return res.status(400).json({
        error: "aadhaar and state are required",
      });
    }

    // 🔷 Get token
    const token = await getToken();

    // 🔷 IMPORTANT: always update this if ngrok changes
    const callbackUrl =
      "https://virtual-scheming-exclaim.ngrok-free.dev/webhook";

    // 🔷 Call SEEK API with dynamic values
    const response = await callSeek(
      token,
      callbackUrl,
      aadhaar,
      state
    );

    // 🔷 Send response back to UI
    res.json({
      correlation_id: response.message.correlation_id,
      status: "processing",
    });

  } catch (error) {
    console.error("Fetch Farmer Error:", error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to fetch farmer data",
    });
  }
});

module.exports = router;