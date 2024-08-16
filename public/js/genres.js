document.addEventListener("DOMContentLoaded", () => {
    initGenresPage();
});

async function initGenresPage() {
    const genreGrid = document.getElementById("genre-grid");
    const tabs = document.querySelectorAll(".tab");

    showLoadingSpinner(genreGrid);
    const movieGenres = await fetchGenres("movie");
    removeLoadingSpinner(genreGrid);

    if (movieGenres) {
        populateGenreGrid(movieGenres.genres, genreGrid, "movie");
    }

    tabs.forEach((tab) => {
        tab.addEventListener("click", async () => {
            const type = tab.dataset.type;

            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");

            showLoadingSpinner(genreGrid);
            const genres = await fetchGenres(type);
            removeLoadingSpinner(genreGrid);

            if (genres) {
                populateGenreGrid(genres.genres, genreGrid, type);
            }
        });
    });
}

function populateGenreGrid(genres, grid, type) {
    grid.innerHTML = "";
    genres.forEach((genre) => {
        const genreItem = document.createElement("div");
        genreItem.classList.add("genre-item");
        genreItem.textContent = genre.name;
        genreItem.addEventListener("click", () => openGenrePage(genre.id, genre.name, type));
        grid.appendChild(genreItem);
    });
}

function openGenrePage(genreId, genreName, type) {
    window.location.href = `/genre-results?id=${genreId}&name=${encodeURIComponent(genreName)}&type=${type}`;
}
