const axios = require("axios");
const crypto = require("crypto");

function getUUID() {
  return crypto.randomUUID();
}

// ✅ UPDATED: now accepts aadhaar + state
async function callSeek(token, callbackUrl, aadhaar, state) {
  const payload = {
    header: {
      version: "0.1.0",
      sender_id: "4fcdb35b-e289-43a9-939a-b2f1f2bafdfd",
      sender_uri: callbackUrl,
      receiver_id: "a5e89f01-519f-4378-93eb-2e1cbfcc512e",
      message_id: getUUID(),
      message_ts: new Date().toISOString(),
      total_count: 1,
      is_msg_encrypted: false,
    },
    message: {
      transaction_id: getUUID(),
      search_request: [
        {
          locale: "en",
          timestamp: new Date().toISOString(),
          reference_id: getUUID(),
          search_criteria: {
            query: {
              mapper_id: "i1002:o1004",
              query_name: "agristack_croparea_v3_get_data",

              // ✅ DYNAMIC INPUT HERE
              query_params: [
                {
                  aadhaar_hash: aadhaar,
                  aadhaar_type: "P",
                  state_lgd_code: state,
                },
              ],
            },
            consent: {},
            reg_type: "agristack_farmer",
            pagination: {
              page_size: 1000,
              page_number: 1,
            },
            query_type: "namedQuery",
          },
        },
      ],
    },
    signature: "",
  };

  console.log("SEEK PAYLOAD:", JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(
      `${process.env.BASE_URL}/sandbox-api/agristack/seek`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("SEEK ERROR:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { callSeek };