const chrome = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/*", async (req, res) => {
  const url = `https://x-minus.pro/${req.params[0] || ""}`;
  try {
    console.log(`Proxying request to: ${url}`);

    const browser = await puppeteer.launch({
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

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
