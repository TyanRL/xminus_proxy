const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Проксирование запросов к сайту x-minus.pro
app.get("/proxy/*", async (req, res) => {
    console.log("Incoming request:", req.originalUrl); // Лог запроса
    try {
      const url = `https://x-minus.pro/${req.params[0]}${req.url.split("?")[1] ? `?${req.url.split("?")[1]}` : ""}`;
      console.log("Proxied URL:", url); // Лог целевого URL
      const response = await axios.get(url);
      res.set(response.headers);
      res.status(response.status).send(response.data);
    } catch (error) {
      console.error("Error:", error.message); // Лог ошибки
      res.status(500).send("Error while proxying the request.");
    }
  });
  

// Обработка корневого запроса
app.get("/", (req, res) => {
  res.send("Proxy for x-minus.pro is running.");
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
