window.onload = function () {
    if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_RELOAD) {
        localStorage.clear();
        sessionStorage.clear();
        if (caches) {
            caches.keys().then(function (names) {
                for (let name of names) caches.delete(name);
            });
        }
    }
};

function showLoader() {
    document.getElementById("page-loader").style.display = "flex";
}

function hideLoader() {
    setTimeout(() => {
        document.getElementById("page-loader").style.display = "none";
    }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    showLoader();
});

window.addEventListener("load", () => {
    hideLoader();
});

function createContentItem(item) {
    const contentItem = document.createElement("div");
    contentItem.classList.add("content-item");
    contentItem.innerHTML = `
        <img src="${TMDB_IMAGE_BASE_URL}${item.poster_path}" alt="${item.title || item.name}">
        <div class="content-item-info">
            <div class="content-item-title">${item.title || item.name}</div>
            <div class="content-item-year">${(item.release_date || item.first_air_date || "").split("-")[0]}</div>
        </div>
    `;
    contentItem.addEventListener("click", () => openContentDetails(item));
    return contentItem;
}

function openContentDetails(item) {
    const type = item.media_type || (item.title ? "movie" : "tv");
    window.location.href = `/${type}/${item.id}`;
}

function showLoadingSpinner(element) {
    element.style.display = "none";

    const spinner = document.createElement("div");
    spinner.classList.add("loading-spinner");
    const container = document.createElement("div");
    container.classList.add("loading-container");
    container.appendChild(spinner);

    element.parentNode.insertBefore(container, element.nextSibling);
}

function removeLoadingSpinner(element) {
    const container = element.parentNode.querySelector(".loading-container");

    if (container) {
        container.remove();
    }

    element.style.display = "";
}
