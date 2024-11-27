const puppeteer = require('puppeteer-core');
const axios = require('axios');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// URL внешнего сервиса browserless
const BROWSERLESS_URL = 'https://chrome.browserless.io/';

app.get('/*', async (req, res) => {
  const url = `https://x-minus.pro/${req.params[0] || ''}`;
  try {
    console.log(`Proxying request to: ${url}`);

    // Запрос к внешнему сервису для получения контента
    const response = await axios.post(
      `${BROWSERLESS_URL}/content?token=YOUR_API_TOKEN`,
      { url },
      { responseType: 'text' }
    );

    res.send(response.data);
  } catch (error) {
    console.error('Error during proxying:', error.message);
    res.status(500).send('Error while proxying the request.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
