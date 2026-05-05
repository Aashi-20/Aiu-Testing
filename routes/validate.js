const express = require("express");
const router = express.Router();
const axios = require("axios");

function compareObjects(expected, actual, path = "") {
  let errors = [];

  for (let key in expected) {
    const currentPath = path ? `${path}.${key}` : key;

    if (!(key in actual)) {
      errors.push(`Missing: ${currentPath}`);
      continue;
    }

    const expVal = expected[key];
    const actVal = actual[key];

    // Array handling
    if (Array.isArray(expVal)) {
      if (!Array.isArray(actVal)) {
        errors.push(`Type mismatch: ${currentPath}`);
        continue;
      }

      if (expVal.length && actVal.length) {
        errors = errors.concat(
          compareObjects(expVal[0], actVal[0], currentPath + "[0]")
        );
      }
    }

    // Object handling (skip empty {})
    else if (
      typeof expVal === "object" &&
      expVal !== null &&
      Object.keys(expVal).length > 0
    ) {
      errors = errors.concat(
        compareObjects(expVal, actVal, currentPath)
      );
    }
  }

  // Extra fields
  for (let key in actual) {
    const currentPath = path ? `${path}.${key}` : key;
    if (!(key in expected)) {
      errors.push(`Extra: ${currentPath}`);
    }
  }

  return errors;
}

router.post("/validate", async (req, res) => {
  try {
    const { actual, mapper } = req.body;

    const actualData =
      actual.data.message.search_response[0].data.reg_records;

    const response = await axios.post(
      "https://developer.agristack.gov.in/xpair/xpair_io_json",
      { xpair_io_name: mapper }
    );

    const expected = response.data;

    const errors = compareObjects(expected, actualData);

    res.json({
      mapper,
      valid: errors.length === 0,
      errors
    });

  } catch (err) {
    res.status(500).json({
      error: "Validation failed",
      details: err.message
    });
  }
});

module.exports = router;