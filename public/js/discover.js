document.addEventListener("DOMContentLoaded", () => {
    initDiscoverPage();
});

async function loadDiscoverResults(type, page, filters = {}) {
    const discoverGrid = document.getElementById("discover-grid");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const currentPageSpan = document.getElementById("current-page");

    showLoadingSpinner(discoverGrid);
    let endpoint = `/discover/${type}?page=${page}`;

    if (filters.sortBy) endpoint += `&sort_by=${filters.sortBy}`;
    if (filters.year) endpoint += `&year=${filters.year}`;

    const discoverData = await fetchTMDBData(endpoint);
    removeLoadingSpinner(discoverGrid);

    if (discoverData) {
        populateContentGrid(discoverData.results, discoverGrid);
        currentPageSpan.textContent = `Page ${page}`;
        prevPageBtn.disabled = page === 1;
        nextPageBtn.disabled = page === discoverData.total_pages;
        smoothScrollToTop();
    }
}

async function initDiscoverPage() {
    const tabs = document.querySelectorAll(".tab");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    let currentPage = 1;

    await loadDiscoverResults("movie", currentPage);

    tabs.forEach((tab) => {
        tab.addEventListener("click", async () => {
            const type = tab.dataset.type;
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            currentPage = 1;
            await loadDiscoverResults(type, currentPage);
        });
    });

    prevPageBtn.addEventListener("click", async () => {
        if (currentPage > 1) {
            currentPage--;
            const activeTab = document.querySelector(".tab.active");
            const type = activeTab.dataset.type;
            await loadDiscoverResults(type, currentPage, getFilters());
        }
    });

    nextPageBtn.addEventListener("click", async () => {
        currentPage++;
        const activeTab = document.querySelector(".tab.active");
        const type = activeTab.dataset.type;
        await loadDiscoverResults(type, currentPage, getFilters());
    });

    initializeFilters();
}

function initializeFilters() {
    const filtersContainer = document.querySelector(".discover-filters");

    filtersContainer.innerHTML = `
        <select id="sort-by">
            <option value="popularity.desc">Popularity Descending</option>
            <option value="popularity.asc">Popularity Ascending</option>
            <option value="vote_average.desc">Rating Descending</option>
            <option value="vote_average.asc">Rating Ascending</option>
        </select>
        <input type="number" id="year" placeholder="Year" min="1900" max="${new Date().getFullYear()}">
        <button id="apply-filters">Apply Filters</button>
    `;

    document.getElementById("apply-filters").addEventListener("click", applyFilters);
}

function getFilters() {
    return {
        sortBy: document.getElementById("sort-by").value,
        year: document.getElementById("year").value,
    };
}

async function applyFilters() {
    const activeTab = document.querySelector(".tab.active");
    const type = activeTab.dataset.type;
    const filters = getFilters();
    currentPage = 1;
    await loadDiscoverResults(type, currentPage, filters);
}
