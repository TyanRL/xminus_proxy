const puppeteer = require("puppeteer");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/*", async (req, res) => {
  const url = `https://x-minus.pro/${req.params[0] || ""}`;
  try {
    console.log(`Opening URL in Puppeteer: ${url}`);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Устанавливаем User-Agent и другие заголовки
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.85"
    );

    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Извлекаем содержимое страницы
    const content = await page.content();
    res.send(content);

    await browser.close();
  } catch (error) {
    console.error("Error during Puppeteer request:", error.message);
    res.status(500).send("Error while fetching the page.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
