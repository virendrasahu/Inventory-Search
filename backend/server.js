const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Load inventory data
const inventoryPath = path.join(__dirname, 'data', 'inventory.json');
let inventory = [];

try {
  const data = fs.readFileSync(inventoryPath, 'utf8');
  inventory = JSON.parse(data);
} catch (error) {
  console.error('Error loading inventory data:', error);
}

// GET /search endpoint
app.get('/search', (req, res) => {
  const { q, category, minPrice, maxPrice } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Validation: minPrice > maxPrice
  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
    return res.status(400).json({ message: 'Invalid price range: minPrice cannot be greater than maxPrice' });
  }

  // Reload inventory data to reflect any changes in the JSON file
  let currentInventory = [];
  try {
    const data = fs.readFileSync(inventoryPath, 'utf8');
    currentInventory = JSON.parse(data);
  } catch (error) {
    console.error('Error loading inventory data:', error);
    return res.status(500).json({ message: 'Error reading inventory data' });
  }

  let allResults = [...currentInventory];

  // 1. Partial Match (Case-insensitive)
  if (q) {
    const searchTerm = q.toLowerCase();
    allResults = allResults.filter(item => 
      item.productName.toLowerCase().includes(searchTerm)
    );
  }

  // 2. Category Match
  if (category && category !== 'All') {
    allResults = allResults.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    );
  }

  // 3. Min Price
  if (minPrice) {
    allResults = allResults.filter(item => item.price >= Number(minPrice));
  }

  // 4. Max Price
  if (maxPrice) {
    allResults = allResults.filter(item => item.price <= Number(maxPrice));
  }

  // 5. Pagination
  const paginatedResults = allResults.slice(startIndex, endIndex);
  
  res.json({
    data: paginatedResults,
    pagination: {
      totalItems: allResults.length,
      totalPages: Math.ceil(allResults.length / limit),
      currentPage: page,
      limit: limit
    }
  });
});

app.listen(PORT, () => {
  console.log(`Inventory Search API running on http://localhost:${PORT}`);
});
