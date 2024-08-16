document.addEventListener("DOMContentLoaded", () => {
    initGenreResultsPage();
});

async function initGenreResultsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const genreId = urlParams.get("id");
    const genreName = urlParams.get("name");
    const type = urlParams.get("type");
    document.getElementById("genre-name").textContent = genreName;
    document.title = `${genreName} - Movieflix`;

    const genreResultsGrid = document.getElementById("genre-results-grid");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const currentPageSpan = document.getElementById("current-page");
    let currentPage = 1;

    async function loadGenreResults(page) {
        showLoadingSpinner(genreResultsGrid);
        const results = await fetchTMDBData(`/discover/${type}?with_genres=${genreId}&page=${page}`);
        removeLoadingSpinner(genreResultsGrid);

        if (results) {
            populateContentGrid(results.results, genreResultsGrid);
            currentPageSpan.textContent = `Page ${page}`;
            prevPageBtn.disabled = page === 1;
            nextPageBtn.disabled = page === results.total_pages;
            smoothScrollToTop();
        }
    }

    await loadGenreResults(currentPage);

    prevPageBtn.addEventListener("click", async () => {
        if (currentPage > 1) {
            currentPage--;
            await loadGenreResults(currentPage);
        }
    });

    nextPageBtn.addEventListener("click", async () => {
        currentPage++;
        await loadGenreResults(currentPage);
    });
}
