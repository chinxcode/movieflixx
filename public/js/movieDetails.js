document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = window.location.pathname.split("/").pop();
    if (movieId) {
        loadMovieDetails(movieId);
    } else {
        console.error("No movie ID provided");
    }
});

async function loadMovieDetails(movieId) {
    const movieDetailSection = document.getElementById("movie-details");

    showLoadingSpinner(movieDetailSection);

    const movieData = await fetchTMDBData(`/movie/${movieId}?`);
    const castData = await fetchTMDBData(`/movie/${movieId}/credits?`);

    if (movieData && castData) {
        removeLoadingSpinner(movieDetailSection);
        updateMovieDetails(movieData, castData);
    }
}

async function updateMovieDetails(movie, cast) {
    document.title = `${movie.title} - Movieflix`;
    document.getElementById("backdrop-image").src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    document.getElementById("poster-image").src = `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`;
    document.getElementById("movie-title").textContent = movie.title;
    document.getElementById("release-year").textContent = movie.release_date.split("-")[0];
    document.getElementById("runtime").textContent = `${movie.runtime} min`;
    document.getElementById("genres").textContent = movie.genres.map((genre) => genre.name).join(", ");
    document.getElementById("vote-average").textContent = movie.vote_average.toFixed(1);
    document.getElementById("overview").textContent = movie.overview;

    const castList = document.getElementById("cast-list");
    cast.cast.slice(0, 10).forEach((actor) => {
        const castItem = document.createElement("div");
        castItem.classList.add("cast-item");
        castItem.innerHTML = `
            <img src="${actor.profile_path ? TMDB_IMAGE_BASE_URL + actor.profile_path : "../assets/no-image.png"}" alt="${actor.name}">
            <div>${actor.name}</div>
            <div>${actor.character}</div>
        `;
        castItem.addEventListener("click", () => {
            window.location.href = `/cast/${actor.id}`;
        });
        castList.appendChild(castItem);
    });

    const watchlistButton = document.getElementById("watchlist-button");
    watchlistButton.textContent = isInWatchlist(movie.id) ? "Remove from Watchlist" : "Add to Watchlist";
    watchlistButton.addEventListener("click", () => {
        if (isInWatchlist(movie.id)) {
            removeFromWatchlist(movie.id);
            watchlistButton.textContent = "Add to Watchlist";
        } else {
            addToWatchlist(movie);
            watchlistButton.textContent = "Remove from Watchlist";
        }
    });
}
