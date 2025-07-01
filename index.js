// const express = require('express');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const cors = require('cors');

// const app = express();
// app.use(cors());

// // Utility to format today's date as DD/MM/YYYY
// function getTodayDateString() {
//   const today = new Date();
//   const dd = String(today.getDate()).padStart(2, '0');
//   const mm = String(today.getMonth() + 1).padStart(2, '0');
//   const yyyy = today.getFullYear();
//   return `${dd}/${mm}/${yyyy}`;
// }

// app.get('/panchangam', async (req, res) => {
//   try {
//     const date = getTodayDateString(); // Get today's date
//     const url = `https://www.drikpanchang.com/telugu/panchanga/telugu-month-panchanga.html?geoname-id=1261446&date=${date}`;

//     const response = await axios.get(url);
//     const html = response.data;
//     const $ = cheerio.load(html);

//     const result = {};

//     $('.dpPanchang .dpElement').each((i, el) => {
//       const key = $(el).find('.dpElementKey').text().trim();
//       const valueSpan = $(el).find('.dpElementValue');

//       if (key.includes('Tithulu')) {
//         result.tithi = {
//           current: valueSpan.text().replace(/\s+/g, ' ').trim(),
//           next: valueSpan.find('a').attr('title') || null
//         };
//       }

//       if (key.includes('Moonsign')) {
//         result.rashi = {
//           current: valueSpan.text().replace(/\s+/g, ' ').trim(),
//           next: valueSpan.find('a').attr('title') || null
//         };
//       }
//     });

//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error scraping Panchangam');
//   }
// });

// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`Panchangam scraper server running on port ${PORT}`);
// });
// const express = require('express');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const cors = require('cors');

// const app = express();
// app.use(cors());

// // Format today's date as DD/MM/YYYY
// function getTodayDateString() {
//   const today = new Date();
//   const dd = String(today.getDate()).padStart(2, '0');
//   const mm = String(today.getMonth() + 1).padStart(2, '0');
//   const yyyy = today.getFullYear();
//   return `${dd}/${mm}/${yyyy}`;
// }

// app.get('/panchangam', async (req, res) => {
//   try {
//     const date = getTodayDateString();
//     const url = `https://www.drikpanchang.com/telugu/panchanga/telugu-month-panchanga.html?geoname-id=1261446&date=${date}`;

//     const response = await axios.get(url);
//     const html = response.data;
//     const $ = cheerio.load(html);

//     const result = {};

//     $('.dpPanchang .dpElement').each((_, el) => {
//       const key = $(el).find('.dpElementKey').text().trim();
//       const valueSpan = $(el).find('.dpElementValue');
//       const value = valueSpan.text().replace(/\s+/g, ' ').trim();
//       const next = valueSpan.find('a').attr('title') || null;

//       // Handle multiple keys with same label (e.g., Karanamulu, Dur Muhurtamulu)
//       switch (key) {
//         case 'Karanamulu':
//           if (!result.karanamulu) result.karanamulu = [];
//           result.karanamulu.push({
//             current: value,
//             next: next
//           });
//           break;

//         case 'Dur Muhurtamulu':
//           if (!result.durMuhurtamulu) result.durMuhurtamulu = [];
//           result.durMuhurtamulu.push({
//             current: value,
//             next: next
//           });
//           break;

//         default:
//           // Normalize key names to use in JSON (e.g., remove spaces, use camelCase)
//           const jsonKey = key
//             .replace(/[^a-zA-Z ]/g, '')
//             .replace(/\s+(.)/g, (m, chr) => chr.toUpperCase())
//             .replace(/\s/g, '')
//             .replace(/^\w/, (c) => c.toLowerCase());

//           result[jsonKey] = {
//             current: value,
//             next: next
//           };
//           break;
//       }
//     });

//     res.json(result);
//   } catch (error) {
//     console.error('Scraping error:', error);
//     res.status(500).send('Error scraping Panchangam');
//   }
// });

// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`✅ Panchangam scraper running at http://localhost:${PORT}/panchangam`);
// });

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/panchangam', async (req, res) => {
  try {
    // Format today's date as dd/mm/yyyy
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const date = `${dd}/${mm}/${yyyy}`;

    const url = `https://www.drikpanchang.com/telugu/panchanga/telugu-month-panchanga.html?geoname-id=1261446&date=${date}`;

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const result = {};

    $('div.dpPanchang p.dpElement').each((i, el) => {
      const key = $(el).find('.dpElementKey').text().trim();
      const value = $(el).find('.dpElementValue').text().trim();
      result[key] = value;
    });

    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error scraping Panchangam');
  }
});

app.get('/', (req, res) => {
  res.send('Panchangam API is up and running!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
