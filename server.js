const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/fema-wms', async (req, res) => {
  try {
    const url = `https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/WmsServer`;

    console.log('➡️ Forwarding WMS request to FEMA with params:', req.query);

    const response = await axios.get(url, {
      params: req.query,
      responseType: 'arraybuffer',
    });

    res.set('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (error) {
    console.error('❌ FEMA WMS error:', error.message);
    if (error.response) {
      console.error('FEMA responded with status:', error.response.status);
      console.error('FEMA response body:', error.response.data.toString());
    }
    res.status(500).send('Error proxying FEMA request');
  }
});


app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
