const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Enable CORS
app.use(cors());

// Proxy endpoint for FEMA WMS
app.get('/public/NFHLWMS/MapServer/export', async (req, res) => {
  try {
    const params = req.query;
    const targetUrl = 'https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/export';

    const response = await axios.get(targetUrl, {
      params,
      responseType: 'arraybuffer',
    });

    res.set('Content-Type', 'image/png');
    res.send(response.data);
  } catch (error) {
    console.error('FEMA WMS proxy error:', error.message);
    res.status(502).send('Error proxying FEMA request');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});




