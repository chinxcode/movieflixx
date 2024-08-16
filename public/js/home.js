document.addEventListener("DOMContentLoaded", () => {
    initHomePage();
});

async function initHomePage() {
    const trendingSlider = document.getElementById("hero-slider");
    const trendingGrid = document.getElementById("trending-grid");
    const moviesGrid = document.getElementById("movies-grid");
    const tvSeriesGrid = document.getElementById("tv-series-grid");

    if (trendingSlider && trendingGrid && moviesGrid && tvSeriesGrid) {
        showLoadingSpinner(trendingSlider);
        showLoadingSpinner(trendingGrid);
        showLoadingSpinner(moviesGrid);
        showLoadingSpinner(tvSeriesGrid);
    } else return;

    const trendingData = await fetchTMDBData("/trending/all/week?");
    const nowPlayingMoviesData = await fetchTMDBData("/movie/now_playing?");
    const airingTodayTVData = await fetchTMDBData("/tv/airing_today?");

    if (trendingData && nowPlayingMoviesData && airingTodayTVData) {
        removeLoadingSpinner(trendingSlider);
        removeLoadingSpinner(trendingGrid);
        removeLoadingSpinner(moviesGrid);
        removeLoadingSpinner(tvSeriesGrid);

        populateHeroSlider(trendingData.results.slice(0, 5), trendingSlider);
        populateContentGrid(trendingData.results, trendingGrid);
        populateContentGrid(nowPlayingMoviesData.results, moviesGrid);
        populateContentGrid(airingTodayTVData.results, tvSeriesGrid);
    }

    initializeTabs();
}

function initializeTabs() {
    const tabSections = document.querySelectorAll("section");
    tabSections.forEach((section) => {
        const tabs = section.querySelectorAll(".tab");
        const grid = section.querySelector(".content-grid");

        tabs.forEach((tab) => {
            tab.addEventListener("click", async () => {
                const category = tab.dataset.category;
                const sectionId = section.id;

                tabs.forEach((t) => t.classList.remove("active"));
                tab.classList.add("active");

                showLoadingSpinner(grid);
                const data = await fetchCategoryData(sectionId, category);
                removeLoadingSpinner(grid);

                if (data) {
                    populateContentGrid(data.results, grid);
                }
            });
        });
    });
}

async function fetchCategoryData(sectionId, category) {
    let endpoint;
    switch (sectionId) {
        case "trending":
            endpoint = `/trending/${category}/week?`;
            break;
        case "movies":
            endpoint = `/movie/${category}?`;
            break;
        case "tv-series":
            endpoint = `/tv/${category}?`;
            break;
    }
    return await fetchTMDBData(endpoint);
}

function populateHeroSlider(items, sliderElement) {
    items.forEach((item, index) => {
        const slide = document.createElement("div");
        slide.classList.add("hero-slide");
        if (index === 0) slide.classList.add("active");
        slide.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${item.backdrop_path})`;

        const content = document.createElement("div");
        content.classList.add("hero-content");
        content.innerHTML = `
            <h1>${item.title || item.name} (${(item.release_date || item.first_air_date || "").split("-")[0]})</h1>
            <button class="cta-button" data-id="${item.id}" data-type="${item.media_type}" onclick="openContentDetail()">Watch Now</button>
        `;

        slide.appendChild(content);
        sliderElement.appendChild(slide);
    });

    initializeSlider();
}

function openContentDetail() {
    let activeSlide = document.querySelector(".hero-slide.active");
    if (!activeSlide) return;
    let button = activeSlide.querySelector(".cta-button");

    let id = button.getAttribute("data-id");
    let type = button.getAttribute("data-type");
    window.location.href = `/${type}/${id}`;
}

function initializeSlider() {
    const slides = document.querySelectorAll(".hero-slide");
    const prevButton = document.getElementById("prev-slide");
    const nextButton = document.getElementById("next-slide");
    let currentSlide = 0;

    function showSlide(index) {
        slides[currentSlide].classList.remove("active");
        slides[index].classList.add("active");
        currentSlide = index;
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    nextButton.addEventListener("click", nextSlide);
    prevButton.addEventListener("click", prevSlide);

    setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
}

function populateContentGrid(items, gridElement) {
    gridElement.innerHTML = "";
    items.forEach((item) => {
        gridElement.appendChild(createContentItem(item));
    });
}
