function addToWatchlist(item) {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    if (!watchlist.some((watchlistItem) => watchlistItem.id === item.id)) {
        watchlist.push({
            id: item.id,
            title: item.title || item.name,
            poster_path: item.poster_path,
            media_type: item.title ? "movie" : "tv",
        });
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
}

function removeFromWatchlist(itemId) {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    watchlist = watchlist.filter((item) => item.id !== itemId);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

function isInWatchlist(itemId) {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    return watchlist.some((item) => item.id === itemId);
}

function getWatchlist() {
    return JSON.parse(localStorage.getItem("watchlist")) || [];
}
