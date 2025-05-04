// Global variables and functions for GOGA search engine
let searchType = 'web'; // Default search type
let currentPage = 1;
const resultsPerPage = 10;
let searchHistory = []; // Store search history
let recentSearches = []; // Store recent searches
let searchApi; // Search API instance

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded, initializing search engine");

    // Replace with your actual API Key and Search Engine ID
    const apiKey = 'AIzaSyC6ijJVg3XMQjb1TQ-oWB535WCVm24YqXA';
    const searchEngineId = '40ddcf9d12b97499f';

    // Initialize search API
    searchApi = new SearchAPI(apiKey, searchEngineId);
    console.log("Search API initialized:", searchApi);

    // DOM Elements
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('results-container');
    const optionButtons = document.querySelectorAll('.option-button');
    const searchContainer = document.querySelector('.search-container');
    const welcomeMessage = document.getElementById('welcome-message');
    const imageSearchButton = document.getElementById('image-search-button');
    const modeToggleButton = document.getElementById('mode-toggle-button');
    
    // Load search history from localStorage if available
    loadSearchHistory();
    
    // Set focus on search input
    searchInput.focus();
    
    // Event Listeners
    searchButton.addEventListener('click', function() {
        console.log("Search button clicked");
        performSearch();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            console.log("Enter key pressed in search input");
            performSearch();
        }
    });
    
    // Add input event for search suggestions
    searchInput.addEventListener('input', showSearchSuggestions);
    
    // Add click event outside search suggestions to hide them
    document.addEventListener('click', function(e) {
        const suggestionBox = document.querySelector('.search-suggestions');
        if (suggestionBox && !searchInput.contains(e.target) && !suggestionBox.contains(e.target)) {
            suggestionBox.remove();
        }
    });
    
    // Search type selection
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            optionButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            searchType = this.getAttribute('data-type');
            console.log("Search type changed to:", searchType);
            
            // If there are already results, update them for the new search type
            if (resultsContainer.classList.contains('active')) {
                performSearch();
            }
        });
    });

    // Dark and Light Mode Toggle
    // Set default mode to dark
    if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'dark-mode');
    }

    // Apply saved mode preference
    const savedMode = localStorage.getItem('theme');
    if (savedMode) {
        document.body.classList.add(savedMode);
        modeToggleButton.textContent = savedMode === 'dark-mode' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }

    modeToggleButton.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            modeToggleButton.textContent = 'Switch to Dark Mode';
            localStorage.setItem('theme', 'light-mode');
        } else {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            modeToggleButton.textContent = 'Switch to Light Mode';
            localStorage.setItem('theme', 'dark-mode');
        }
    });
    
    console.log("All event listeners attached");
});

// Simplified Google Custom Search API integration
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');

const apiKey = 'AIzaSyC6ijJVg3XMQjb1TQ-oWB535WCVm24YqXA';
const searchEngineId = '40ddcf9d12b97499f';

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) {
        resultsContainer.innerHTML = '<p>Please enter a search term.</p>';
        return;
    }

    // Fetch results from Google Custom Search API
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.items && data.items.length > 0) {
                resultsContainer.innerHTML = data.items.map(item => `
                    <div class="result-item">
                        <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                        <p>${item.snippet}</p>
                    </div>
                `).join('');
            } else {
                resultsContainer.innerHTML = '<p>No results found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
            resultsContainer.innerHTML = '<p>There was an error fetching the search results. Please try again later.</p>';
        });
});

// Add functionality for image search
const imageSearchButton = document.getElementById('image-search-button');

imageSearchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) {
        resultsContainer.innerHTML = '<p>Please enter a search term.</p>';
        return;
    }

    // Fetch image results from Google Custom Search API
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&searchType=image`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.items && data.items.length > 0) {
                resultsContainer.innerHTML = data.items.map(item => `
                    <div class="result-item">
                        <img src="${item.link}" alt="${item.title}" style="max-width: 100%; height: auto;" />
                        <p>${item.title}</p>
                    </div>
                `).join('');
            } else {
                resultsContainer.innerHTML = '<p>No image results found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching image search results:', error);
            resultsContainer.innerHTML = '<p>There was an error fetching the image search results. Please try again later.</p>';
        });
});