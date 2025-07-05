const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const FEMA_WMS_URL = 'https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHLWMS/MapServer/export';

app.get('/fema-proxy', async (req, res) => {
  try {
    const { query } = req;
    const urlParams = new URLSearchParams(query).toString();
    const femaUrl = `${FEMA_WMS_URL}?${urlParams}`;

    const response = await axios.get(femaUrl, {
      responseType: 'arraybuffer',
    });

    res.set('Content-Type', 'image/png');
    res.send(response.data);
  } catch (error) {
    console.error('FEMA WMS error:', error.message);
    res.status(502).send('Error proxying FEMA request');
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});





