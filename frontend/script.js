const searchForm = document.getElementById('search-form');
const qInput = document.getElementById('q');
const categorySelect = document.getElementById('category');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
const resultsContainer = document.getElementById('results-container');
const resultsHeader = document.getElementById('results-header');
const resultsCount = document.getElementById('results-count');
const errorDisplay = document.getElementById('error-message');
const searchBtn = document.getElementById('search-btn');
const paginationContainer = document.getElementById('pagination-container');

let currentPage = 1;

const API_URL = window.location.protocol === 'file:' 
    ? 'http://localhost:3000/search' 
    : '/search';

searchForm.addEventListener('submit', async (e) => {
    if (e) e.preventDefault();
    currentPage = 1; // Reset to first page on new search
    fetchResults(1);
});

async function fetchResults(page = 1) {
    // Reset state
    errorDisplay.textContent = '';
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';
    resultsContainer.style.opacity = '0.5';
    
    const params = new URLSearchParams();
    if (qInput.value.trim()) params.append('q', qInput.value.trim());
    if (categorySelect.value !== 'All') params.append('category', categorySelect.value);
    if (minPriceInput.value) params.append('minPrice', minPriceInput.value);
    if (maxPriceInput.value) params.append('maxPrice', maxPriceInput.value);
    
    params.append('page', page);
    params.append('limit', 10);

    console.log(`Fetching from: ${API_URL}?${params.toString()}`);

    try {
        const response = await fetch(`${API_URL}?${params.toString()}`);
        console.log('Response status:', response.status);
        
        const responseData = await response.json();
        console.log('Data received:', responseData);

        if (!response.ok) {
            throw new Error(responseData.message || 'Something went wrong');
        }

        renderResults(responseData.data);
        renderPagination(responseData.pagination);
    } catch (error) {
        console.error('Fetch error:', error);
        errorDisplay.textContent = 'Error: ' + error.message;
        renderResults([]);
        renderPagination(null);
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = 'Find Inventory';
        resultsContainer.style.opacity = '1';
    }
}

function renderResults(products) {
    resultsContainer.innerHTML = '';
    
    if (!products || products.length === 0) {
        resultsHeader.style.display = 'none';
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <h3>No results found</h3>
                <p>Try adjusting your search criteria or price range.</p>
            </div>
        `;
        return;
    }

    resultsHeader.style.display = 'block';
    
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
            ${products.map(product => `
                <tr>
                    <td><strong>${product.productName}</strong></td>
                    <td><span class="category-badge">${product.category}</span></td>
                    <td class="price-cell">$${Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td>${product.supplier}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    
    resultsContainer.appendChild(table);
}

function renderPagination(pagination) {
    paginationContainer.innerHTML = '';
    
    if (!pagination || pagination.totalPages <= 1) {
        if (pagination) {
            resultsCount.textContent = `Showing all ${pagination.totalItems} product${pagination.totalItems === 1 ? '' : 's'}`;
        }
        return;
    }

    const { totalItems, totalPages, currentPage: page } = pagination;
    resultsCount.textContent = `Showing items ${(page-1)*10 + 1} - ${Math.min(page*10, totalItems)} of ${totalItems}`;

    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Previous
    `;
    prevBtn.disabled = page === 1;
    prevBtn.onclick = () => {
        currentPage = page - 1;
        fetchResults(currentPage);
    };

    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.innerHTML = `
        Next
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    `;
    nextBtn.disabled = page === totalPages;
    nextBtn.onclick = () => {
        currentPage = page + 1;
        fetchResults(currentPage);
    };

    const pageInfo = document.createElement('div');
    pageInfo.className = 'page-info';
    pageInfo.innerHTML = `Page <span>${page}</span> of ${totalPages}`;

    paginationContainer.appendChild(prevBtn);
    paginationContainer.appendChild(pageInfo);
    paginationContainer.appendChild(nextBtn);
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized, loading initial data...');
    fetchResults(1);
});
