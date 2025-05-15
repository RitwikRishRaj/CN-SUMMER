//its the main entry point
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/api/github", async (req, res) => {
  try {
    const response = await axios.get("https://api.github.com/users/octocat");
    res.json(response.data);
  } catch (err) {
    res.status(500).send("GitHub API Error");
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
