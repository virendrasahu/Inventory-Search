// Backend API configuration
const API_BASE_URL = 'https://inventory-search-u1ls.onrender.com';
const API_ENDPOINT = '/search';

// DOM elements
const searchInput = document.getElementById('q');
const categorySelect = document.getElementById('category');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
const searchBtn = document.getElementById('search-btn');
const resultsContainer = document.getElementById('results-container');
const errorDisplay = document.getElementById('error-message');

// Add event listener to search button
searchBtn.addEventListener('click', searchProducts);

// Optional: Debounce search input for better performance
let debounceTimer;
searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(searchProducts, 500); // Wait 500ms after user stops typing
});

// Main search function
async function searchProducts() {
    // Read input values
    const query = searchInput.value.trim();
    const category = categorySelect.value;
    const minPrice = minPriceInput.value.trim();
    const maxPrice = maxPriceInput.value.trim();

    // Build query parameters dynamically (only include if they exist)
    const params = new URLSearchParams();

    if (query) params.append('q', query);
    if (category && category !== 'All') params.append('category', category);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);

    // Build the full API URL
    const apiUrl = `${API_BASE_URL}${API_ENDPOINT}?${params.toString()}`;

    // Clear previous error messages
    errorDisplay.textContent = '';

    // Show loading state
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';

    try {
        // Call the backend API using fetch
        const response = await fetch(apiUrl);

        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse JSON response
        const data = await response.json();

        // Pass data to display function
        displayResults(data);

    } catch (error) {
        // Handle errors and show in UI
        console.error('Search error:', error);
        errorDisplay.textContent = `Error: ${error.message}. Please try again.`;
        displayResults([]); // Show no results on error
    } finally {
        // Reset button state
        searchBtn.disabled = false;
        searchBtn.textContent = 'Find Inventory';
    }
}

// Function to display search results
function displayResults(data) {
    // Clear previous results
    resultsContainer.innerHTML = '';

    // Check if data is empty or no results
    if (!data || data.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <h3>No results found</h3>
                <p>Try adjusting your search criteria.</p>
            </div>
        `;
        return;
    }

    // Create results table
    const table = document.createElement('table');
    table.className = 'results-table';

    table.innerHTML = `
        <thead>
            <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Supplier</th>
            </tr>
        </thead>
        <tbody>
            ${data.map(product => `
                <tr>
                    <td>${product.productName}</td>
                    <td>${product.category}</td>
                    <td>$${product.price}</td>
                    <td>${product.supplier}</td>
                </tr>
            `).join('')}
        </tbody>
    `;

    resultsContainer.appendChild(table);
}
