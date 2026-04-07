---
# 📦 Inventory Search API + UI

## 📌 Overview

This project is a simple **Inventory Search System** that allows users to search and filter products from multiple suppliers. It includes a backend API and a basic frontend interface.

Users can search products by:

* Product name (partial match)
* Category
* Price range (min & max)

---

## 🎯 Objective

The goal of this project is to build a search feature that helps users quickly find relevant products instead of manually browsing large inventories.

---

## 🚀 Features

* 🔍 Search products by name (case-insensitive)
* 📂 Filter by category
* 💰 Filter by price range (minPrice & maxPrice)
* 🔗 Combine multiple filters together
* 📋 Display results in list/table format
* ❌ “No results found” state
* ⚠️ Error handling for invalid price range
* 🌐 REST API (`GET /search`)
* ⚡ Fast filtering using in-memory data

---

## 🛠️ Tech Stack

### Frontend

* HTML
* CSS
* JavaScript (Vanilla JS)

### Backend

* Node.js
* Express.js

### Tools

* VS Code
* Postman (API testing)
* Browser (Chrome)

### Data Source

* Static JSON file (inventory data)

---

## 📂 Project Structure

```
inventory-search-project/
├── backend/
│   ├── data/
│   │   └── inventory.json
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md
```

---

## ⚙️ How It Works

1. User enters search filters in UI
2. Frontend sends request to `/search` API
3. Backend:

   * Reads query params (`q`, `category`, `minPrice`, `maxPrice`)
   * Filters inventory data step-by-step
4. Filtered results returned as JSON
5. Frontend displays results

---

## 🔎 API Endpoint

### `GET /search`

### Query Parameters (optional)

| Param    | Description                  |
| -------- | ---------------------------- |
| q        | Product name (partial match) |
| category | Product category             |
| minPrice | Minimum price                |
| maxPrice | Maximum price                |

### Example Requests

```
/search
/search?q=chair
/search?category=Furniture
/search?minPrice=100&maxPrice=500
/search?q=desk&category=Furniture&minPrice=100&maxPrice=300
```

---

## ⚠️ Edge Cases Handled

* Empty search → returns all products
* Invalid price range → returns `400 Bad Request`
* No results → returns empty array (`[]`)

---

## 💻 How to Run Locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/inventory-search.git
cd inventory-search-project
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

### Run the server

```bash
node server.js
```

Server will start on:

```
http://localhost:3000
```

---

### 3️⃣ Run Frontend

* Open `frontend/index.html` in browser
  **OR**
* Use Live Server in VS Code

---

### 4️⃣ Test API

Use:

* Browser
* Postman

Example:

```
http://localhost:3000/search?q=chair
```

---

## 🖼️ Screenshots

### 🔍 Search UI

(Add screenshot here)

```
/screenshots/search-ui.png
```

### 📊 Results Display

(Add screenshot here)

```
/screenshots/results.png
```

### ❌ No Results State

(Add screenshot here)

```
/screenshots/no-results.png
```

---

## 📈 Performance Improvement (Future Scope)

For large datasets, we can improve performance by:

* ✅ Using a database (MongoDB / PostgreSQL)
* ✅ Adding indexing on fields like `productName`, `category`, `price`
* ✅ Implementing pagination
* ✅ Debouncing search input
* ✅ Using full-text search (ElasticSearch)

---

## 🧠 Learning Outcomes

* Building REST APIs using Express
* Handling query parameters
* Filtering data dynamically
* Connecting frontend with backend
* Handling real-world edge cases

---

## 👨‍💻 Author

**Virendra Sahu**

* Full Stack Developer
* GitHub: [https://github.com/virendrasahu](https://github.com/virendrasahu)

---


