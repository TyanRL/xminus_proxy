const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/*", async (req, res) => {
  try {
    const path = req.params[0] || "";
    const url = `https://x-minus.pro/${path}${req.url.includes("?") ? `?${req.url.split("?")[1]}` : ""}`;
    console.log(`Proxying request to: ${url}`);

    // Отправляем запрос с необходимыми заголовками
    const response = await axios.get(url, {
      headers: {
        "User-Agent": req.headers["user-agent"] || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
        "Referer": "https://x-minus.pro/",
        "Origin": "https://x-minus.pro",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Cache-Control": "no-cache",
      },
    });

    res.set(response.headers);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Error during proxying:", error.message);
    res.status(error.response?.status || 500).send(error.response?.data || "Error while proxying the request.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
