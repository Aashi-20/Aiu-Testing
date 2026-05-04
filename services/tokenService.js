const axios = require("axios");

async function getToken() {
  try {
    const response = await axios.post(
      `${process.env.BASE_URL}/sandbox-api/nm/token`,
      new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        grant_type: "password",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("Token Error:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { getToken };