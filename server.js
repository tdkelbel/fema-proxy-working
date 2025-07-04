const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/fema-wms', async (req, res) => {
  try {
    const target = 'https://hazards.fema.gov/arcgis/rest/services/public/NFHLWMS/MapServer/WMSServer';
    const response = await axios.get(target, {
      params: req.query,
      responseType: 'arraybuffer',
    });
    res.set('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (err) {
    console.error('❌ FEMA proxy error:', err.message);
    res.status(500).send('Error proxying FEMA WMS');
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`✅ Proxy running on port ${port}`);
});




