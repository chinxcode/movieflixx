document.addEventListener("DOMContentLoaded", () => {
    loadMyList();
});

function loadMyList() {
    const watchlist = getWatchlist();
    const moviesGrid = document.getElementById("movies-grid");
    const tvShowsGrid = document.getElementById("tvshows-grid");

    showLoadingSpinner(moviesGrid);
    showLoadingSpinner(tvShowsGrid);

    const movies = watchlist.filter((item) => item.media_type === "movie");
    const tvShows = watchlist.filter((item) => item.media_type === "tv");

    removeLoadingSpinner(moviesGrid);
    removeLoadingSpinner(tvShowsGrid);

    populateMyListGrid(movies, moviesGrid);
    populateMyListGrid(tvShows, tvShowsGrid);
}

function populateMyListGrid(items, gridElement) {
    gridElement.innerHTML = "";
    items.forEach((item) => {
        const contentItem = createMyListItem(item);
        gridElement.appendChild(contentItem);
    });
}

function createMyListItem(item) {
    const contentItem = document.createElement("div");
    contentItem.classList.add("content-item");
    contentItem.innerHTML = `
        <img src="${TMDB_IMAGE_BASE_URL}${item.poster_path}" alt="${item.title}">
        <div class="content-item-info">
            <div class="content-item-title">${item.title}</div>
        </div>
        <button class="remove-button" title="Remove from My List">×</button>
    `;
    contentItem.addEventListener("click", (e) => {
        if (!e.target.classList.contains("remove-button")) {
            openContentDetails(item);
        }
    });
    contentItem.querySelector(".remove-button").addEventListener("click", (e) => {
        e.stopPropagation();
        removeFromWatchlist(item.id);
        contentItem.remove();
    });
    return contentItem;
}

function openContentDetails(item) {
    window.location.href = `/${item.media_type}/${item.id}`;
}
