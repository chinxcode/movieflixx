document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tvShowId = window.location.pathname.split("/").pop();
    if (tvShowId) {
        loadTVShowDetails(tvShowId);
    } else {
        console.error("No TV show ID provided");
    }
});

async function loadTVShowDetails(tvShowId) {
    const tvShowDetailSection = document.getElementById("tvshow-details");

    showLoadingSpinner(tvShowDetailSection);

    const tvShowData = await fetchTMDBData(`/tv/${tvShowId}?`);
    const castData = await fetchTMDBData(`/tv/${tvShowId}/credits?`);

    if (tvShowData && castData) {
        removeLoadingSpinner(tvShowDetailSection);
        updateTVShowDetails(tvShowData, castData);
    }
}

function updateTVShowDetails(tvShow, cast) {
    document.title = `${tvShow.name} - Movieflix`;
    document.getElementById("backdrop-image").src = `https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`;
    document.getElementById("poster-image").src = `${TMDB_IMAGE_BASE_URL}${tvShow.poster_path}`;
    document.getElementById("tvshow-title").textContent = tvShow.name;
    document.getElementById("first-air-date").textContent = tvShow.first_air_date.split("-")[0];
    document.getElementById("number-of-seasons").textContent = `${tvShow.number_of_seasons} seasons`;
    document.getElementById("genres").textContent = tvShow.genres.map((genre) => genre.name).join(", ");
    document.getElementById("vote-average").textContent = tvShow.vote_average.toFixed(1);
    document.getElementById("overview").textContent = tvShow.overview;

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

    const seasonList = document.getElementById("season-list");
    tvShow.seasons.forEach((season) => {
        if (season.season_number !== 0) {
            const seasonItem = document.createElement("div");
            seasonItem.classList.add("season-item");
            seasonItem.innerHTML = `
                <img src="${season.poster_path ? TMDB_IMAGE_BASE_URL + season.poster_path : "../assets/no-image.png"}" alt="Season ${
                season.season_number
            }">
                <div>Season ${season.season_number}</div>
            `;
            seasonItem.addEventListener("click", () => {
                document.querySelectorAll(".season-item").forEach((item) => item.classList.remove("selected"));
                seasonItem.classList.add("selected");
                loadEpisodes(tvShow.id, season.season_number);
            });
            seasonList.appendChild(seasonItem);
        }
    });

    const watchlistButton = document.getElementById("watchlist-button");
    watchlistButton.textContent = isInWatchlist(tvShow.id) ? "Remove from Watchlist" : "Add to Watchlist";
    watchlistButton.addEventListener("click", () => {
        if (isInWatchlist(tvShow.id)) {
            removeFromWatchlist(tvShow.id);
            watchlistButton.textContent = "Add to Watchlist";
        } else {
            addToWatchlist(tvShow);
            watchlistButton.textContent = "Remove from Watchlist";
        }
    });
}

async function loadEpisodes(tvShowId, seasonNumber) {
    const seasonData = await fetchTMDBData(`/tv/${tvShowId}/season/${seasonNumber}?`);
    if (seasonData) {
        displayEpisodes(seasonData.episodes, tvShowId, seasonNumber);
    }
}

async function displayEpisodes(episodes, tvShowId, seasonNumber) {
    const episodeList = document.getElementById("episode-list");
    episodeList.innerHTML = "";

    for (const episode of episodes) {
        const episodeItem = document.createElement("div");
        episodeItem.classList.add("episode-item");
        episodeItem.innerHTML = `
            <img src="${episode.still_path ? TMDB_IMAGE_BASE_URL + episode.still_path : "../assets/no-image.png"}" alt="${episode.name}">
            <div>${episode.episode_number}. ${episode.name}</div>
        `;

        episodeList.appendChild(episodeItem);
    }
}
