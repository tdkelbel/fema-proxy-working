const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

app.get("/fema-wms", async (req, res) => {
  try {
    const femaUrl =
      "https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/export";

    const bbox = req.query.bbox || "-79.795,36.071,-79.791,36.075";
    const size = req.query.size || "800,800";

    const params = {
      f: "image",
      format: "png",
      transparent: "true",
      layers: "show:28",
      bbox: bbox,
      bboxSR: "4326",
      imageSR: "4326",
      size: size,
    };

    const headers = {
      "User-Agent": "Mozilla/5.0",
      Referer: "https://hazards.fema.gov",
    };

    const response = await axios.get(femaUrl, {
      params,
      responseType: "arraybuffer",
      headers,
    });

    res.set("Content-Type", "image/png");
    res.send(response.data);
  } catch (error) {
    console.error("❌ FEMA request error:", error.message);
    if (error.response) {
      console.error("➡️ Response status:", error.response.status);
      console.error("➡️ Response body:", error.response.data?.toString?.());
    }
    res.status(500).send("Error proxying FEMA request");
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Proxy running on port ${port}`);
});



