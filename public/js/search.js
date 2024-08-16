document.addEventListener("DOMContentLoaded", () => {
    initializeSearch();
    if (document.querySelector(".search-results-container")) {
        initSearchResultsPage();
    }
});

function initializeSearch() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const header = document.querySelector("header");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        menuToggle.classList.toggle("active");

        if (menuToggle.classList.contains("active")) {
            menuToggle.querySelector("span:first-child").style.transform = "rotate(45deg) translate(5px, 5px)";
            menuToggle.querySelector("span:nth-child(2)").style.opacity = "0";
            menuToggle.querySelector("span:last-child").style.transform = "rotate(-45deg) translate(7px, -6px)";
        } else {
            menuToggle.querySelector("span:first-child").style.transform = "none";
            menuToggle.querySelector("span:nth-child(2)").style.opacity = "1";
            menuToggle.querySelector("span:last-child").style.transform = "none";
        }
    });

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.style.background = "rgba(0, 0, 0, 0.9)";
        } else {
            header.style.background = "rgba(0, 0, 0, 0.8)";
        }
    });

    searchInput.addEventListener("input", debounce(handleSearch, 300));
    searchInput.addEventListener("keypress", handleSearchKeyPress);
}

async function handleSearch() {
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");
    const query = searchInput.value.trim();
    if (query.length > 2) {
        const data = await fetchTMDBData(`/search/multi?query=${encodeURIComponent(query)}&include_adult=false`);
        if (data && data.results) {
            const filteredResults = data.results.filter((item) => item.media_type === "movie" || item.media_type === "tv");
            displaySearchResults(filteredResults);
        }
    } else {
        searchResults.style.display = "none";
    }
}

function handleSearchKeyPress(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const query = event.target.value.trim();
        if (query.length > 2) {
            window.location.href = `../search-results?query=${encodeURIComponent(query)}`;
        }
    }
}

function displaySearchResults(results) {
    const searchResults = document.getElementById("search-results");
    searchResults.innerHTML = "";
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="no-results">No results found</div>';
    } else {
        results.slice(0, 3).forEach((item) => {
            const resultItem = document.createElement("div");
            resultItem.classList.add("search-result-item");
            resultItem.innerHTML = `
                <img src="${item.poster_path ? TMDB_IMAGE_BASE_URL + item.poster_path : "assets/no-image.png"}" alt="${
                item.title || item.name
            }">
            <div>
                <h3>${item.title || item.name}</h3>
                <ul>
                    <li>${(item.release_date || item.first_air_date || "").split("-")[0]}</li>
                    <li>${item.media_type}</li>
                </ul>
            </div>
            `;

            resultItem.addEventListener("click", () => openSearchContentDetail(item.id, item.media_type));
            searchResults.appendChild(resultItem);
        });

        const viewAllResults = document.createElement("div");
        viewAllResults.classList.add("view-all-results");
        viewAllResults.innerHTML = "<strong>View All Results</strong>";
        viewAllResults.addEventListener("click", () => {
            const searchInput = document.getElementById("search-input");
            window.location.href = `../search-results?query=${encodeURIComponent(searchInput.value.trim())}`;
        });
        searchResults.appendChild(viewAllResults);
    }
    searchResults.style.display = "block";
}

function openSearchContentDetail(id, type) {
    window.location.href = `/${type}/${id}`;
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

async function initSearchResultsPage() {
    const searchResultsGrid = document.getElementById("search-results-grid");
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query");

    if (query) {
        document.title = `Search Results for "${query}" - Movieflix`;
        document.querySelector("h1").textContent = `Search Results for "${query}"`;

        showLoadingSpinner(searchResultsGrid);
        const searchData = await fetchTMDBData(`/search/multi?query=${encodeURIComponent(query)}&include_adult=false`);
        removeLoadingSpinner(searchResultsGrid);

        if (searchData && searchData.results) {
            const filteredResults = searchData.results.filter((item) => item.media_type === "movie" || item.media_type === "tv");
            populateContentGrid(filteredResults, searchResultsGrid);
        } else {
            searchResultsGrid.innerHTML = '<div class="no-results">No results found</div>';
        }
    } else {
        searchResultsGrid.innerHTML = '<div class="no-results">No search query provided</div>';
    }

    initializePagination();
}

function initializePagination() {
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const currentPageSpan = document.getElementById("current-page");
    let currentPage = 1;

    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            updateSearchResults(currentPage);
        }
    });

    nextPageBtn.addEventListener("click", () => {
        currentPage++;
        updateSearchResults(currentPage);
    });

    async function updateSearchResults(page) {
        const searchResultsGrid = document.getElementById("search-results-grid");
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get("query");

        showLoadingSpinner(searchResultsGrid);
        const searchData = await fetchTMDBData(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`);
        removeLoadingSpinner(searchResultsGrid);

        if (searchData && searchData.results) {
            populateContentGrid(searchData.results, searchResultsGrid);
            currentPageSpan.textContent = `Page ${page}`;
            prevPageBtn.disabled = page === 1;
            nextPageBtn.disabled = page === searchData.total_pages;
            smoothScrollToTop();
        }
    }
}

function smoothScrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}
