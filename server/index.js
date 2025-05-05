const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5174;

app.use(cors());

// Palauta resourcepacks.json
app.get('/resourcepacks', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, 'resourcepacks.json'));
  res.json(JSON.parse(data));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});