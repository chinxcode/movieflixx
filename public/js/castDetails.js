document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const personId = window.location.pathname.split("/").pop();

    if (personId) {
        loadCastDetails(personId);
    } else {
        console.error("No person ID provided");
    }
});

async function loadCastDetails(personId) {
    const personData = await fetchTMDBData(`/person/${personId}?append_to_response=external_ids,images`);
    const creditsData = await fetchTMDBData(`/person/${personId}/combined_credits?`);

    if (personData && creditsData) {
        updateCastDetails(personData, creditsData);
    }
}

function updateCastDetails(person, credits) {
    document.title = `${person.name} - StreamFlix`;
    document.getElementById("profile-image").src = `${TMDB_IMAGE_BASE_URL}${person.profile_path}`;
    document.getElementById("cast-name").textContent = person.name;
    document.getElementById("biography").textContent = person.biography;

    document.getElementById("known-for").textContent = "Acting";
    document.getElementById("known-credits").textContent = credits.cast.length;
    document.getElementById("gender").textContent = person.gender === 1 ? "Female" : "Male";
    document.getElementById("birthday").textContent = person.birthday || "N/A";
    document.getElementById("place-of-birth").textContent = person.place_of_birth || "N/A";

    updateSocialLinks(person.external_ids);
    updateKnownFor(credits.cast);
    updateActingCredits(credits.cast);
    updatePhotos(person.images.profiles);
}

function updateSocialLinks(externalIds) {
    const socialLinks = document.getElementById("social-links");
    const socialPlatforms = [
        { id: "imdb_id", icon: "fab fa-imdb", url: "https://www.imdb.com/name/" },
        { id: "facebook_id", icon: "fab fa-facebook", url: "https://www.facebook.com/" },
        { id: "instagram_id", icon: "fab fa-instagram", url: "https://www.instagram.com/" },
        { id: "twitter_id", icon: "fab fa-twitter", url: "https://twitter.com/" },
    ];

    socialPlatforms.forEach((platform) => {
        if (externalIds[platform.id]) {
            const link = document.createElement("a");
            link.href = platform.url + externalIds[platform.id];
            link.target = "_blank";
            link.innerHTML = `<i class="${platform.icon}"></i>`;
            socialLinks.appendChild(link);
        }
    });
}

function updateKnownFor(cast) {
    const knownForList = document.getElementById("known-for-list");
    cast.sort((a, b) => b.vote_count - a.vote_count)
        .slice(0, 10)
        .forEach((item) => {
            const movieCard = document.createElement("div");
            movieCard.classList.add("movie-card");
            movieCard.innerHTML = `
            <img src="${TMDB_IMAGE_BASE_URL}${item.poster_path}" alt="${item.title || item.name}">
            <div class="title">${item.title || item.name}</div>
        `;
            movieCard.addEventListener("click", () => openContentDetails(item.id, item.media_type));
            knownForList.appendChild(movieCard);
        });
}

function updateActingCredits(cast) {
    const actingCredits = document.getElementById("acting-credits");
    const expandButton = document.getElementById("expand-credits");

    cast.sort((a, b) => new Date(b.release_date || b.first_air_date) - new Date(a.release_date || a.first_air_date)).forEach(
        (item, index) => {
            const creditItem = document.createElement("div");
            creditItem.classList.add("credit-item");
            if (index >= 10) creditItem.style.display = "none";

            const year = new Date(item.release_date || item.first_air_date).getFullYear();
            creditItem.innerHTML = `
            <span class="year">${year || "TBA"}</span>
            <span class="title">${item.title || item.name}</span>
            <span class="character">${item.character ? "as " + item.character : ""}</span>
        `;
            actingCredits.appendChild(creditItem);
        }
    );

    expandButton.addEventListener("click", () => {
        actingCredits.classList.toggle("expanded");
        const hiddenItems = actingCredits.querySelectorAll('.credit-item[style="display: none;"]');
        hiddenItems.forEach((item) => (item.style.display = ""));
        expandButton.style.display = "none";
    });
}

function updatePhotos(photos) {
    const photoGrid = document.getElementById("photo-grid");
    photos.slice(0, 12).forEach((photo) => {
        const photoItem = document.createElement("div");
        photoItem.classList.add("photo-item");
        photoItem.innerHTML = `<img src="${TMDB_IMAGE_BASE_URL}${photo.file_path}" alt="Actor Photo">`;
        photoGrid.appendChild(photoItem);
    });
}

function openContentDetails(id, mediaType) {
    window.location.href = `/${mediaType}/${id}`;
}
