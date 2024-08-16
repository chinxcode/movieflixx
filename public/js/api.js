const TMDB_BASE_URL = "/api";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

async function fetchTMDBData(endpoint) {
    try {
        const response = await fetch(`${TMDB_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

async function fetchGenres(type) {
    return await fetchTMDBData(`/genre/${type}/list?`);
}

async function fetchDiscoverContent(type, options = {}) {
    let endpoint = `/discover/${type}?`;
    for (const [key, value] of Object.entries(options)) {
        endpoint += `&${key}=${value}`;
    }
    return await fetchTMDBData(endpoint);
}
