const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/fema-wms', async (req, res) => {
  try {
    const url = `https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/export`;

    console.log('➡️ Forwarding request to FEMA export endpoint with params:', req.query);

    const response = await axios.get(url, {
      params: {
        f: 'image',
        format: 'png',
        transparent: true,
        layers: 'show:28', // Flood hazard zones layer
        ...req.query,
      },
      responseType: 'arraybuffer',
    });

    res.set('Content-Type', 'image/png');
    res.send(response.data);
  } catch (error) {
    console.error('❌ FEMA proxy error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data.toString());
    }
    res.status(500).send('Error proxying FEMA export request');
  }
});



app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
