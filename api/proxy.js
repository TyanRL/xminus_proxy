const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Проксирование всех запросов, включая корневой ("/")
app.get("/*", async (req, res) => {
  try {
    // Формируем целевой URL
    const path = req.params[0] || ""; // Получаем путь из запроса
    const url = `https://x-minus.pro/${path}${req.url.includes("?") ? `?${req.url.split("?")[1]}` : ""}`;

    // Логируем запрос для отладки
    console.log(`Proxying request to: ${url}`);

    // Отправляем запрос на x-minus.pro
    const response = await axios.get(url, {
      headers: {
        "User-Agent": req.headers["user-agent"] || "Mozilla/5.0 (compatible; Proxy/1.0)",
      },
    });

    // Устанавливаем заголовки и отправляем ответ
    res.set(response.headers);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Error during proxying:", error.message);
    res.status(500).send("Error while proxying the request.");
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
