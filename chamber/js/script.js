// Toggle Navigation
const menuButton = document.getElementById("menu-button");
const menu = document.getElementById("menu");

menuButton.addEventListener("click", () => {
    menu.classList.toggle("open");
});

// Dynamic Footer
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("last-modified").textContent = document.lastModified;

// Fetch Members for Directory Page
const membersContainer = document.getElementById("members");
if (membersContainer) {
    async function getMembers() {
        try {
            const response = await fetch("data/members.json");
            if (!response.ok) throw new Error("Failed to load members.json");
            const members = await response.json();
            displayMembers(members);
        } catch (error) {
            console.error("Error loading members:", error);
            membersContainer.innerHTML = "<p class='error'>⚠️ Unable to load members at this time.</p>";
        }
    }

    function displayMembers(members) {
        membersContainer.innerHTML = "";
        members.forEach(member => {
            const card = document.createElement("div");
            card.classList.add("member-card");

            card.innerHTML = `
          <img src="${member.image}" alt="${member.name} logo" loading="lazy">
          <h3>${member.name}</h3>
          <p>${member.address}</p>
          <p>${member.phone}</p>
          <a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a>
          <p><strong>${member.membership} Member</strong></p>
        `;
            membersContainer.appendChild(card);
        });
    }

    // View Toggle
    document.getElementById("grid-btn").addEventListener("click", () => {
        membersContainer.classList.add("grid");
        membersContainer.classList.remove("list");
    });

    document.getElementById("list-btn").addEventListener("click", () => {
        membersContainer.classList.add("list");
        membersContainer.classList.remove("grid");
    });

    // Init
    getMembers();
}

// Spotlight Members for Home Page
const spotlightContainer = document.getElementById("spotlight-members");
if (spotlightContainer) {
    async function getSpotlights() {
        try {
            const response = await fetch("data/members.json");
            if (!response.ok) throw new Error("Failed to load members.json");
            const members = await response.json();
            displaySpotlights(members);
        } catch (error) {
            console.error("Error loading spotlights:", error);
            spotlightContainer.innerHTML = "<p class='error'>⚠️ Unable to load spotlight members.</p>";
        }
    }

    function displaySpotlights(members) {
        const filtered = members.filter(m => m.membership === "Gold" || m.membership === "Silver");
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        spotlightContainer.innerHTML = "";
        selected.forEach(member => {
            const card = document.createElement("div");
            card.classList.add("member-card");

            card.innerHTML = `
          <img src="${member.image}" alt="${member.name} logo" loading="lazy">
          <h3>${member.name}</h3>
          <p>${member.address}</p>
          <p>${member.phone}</p>
          <a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a>
          <p><strong>${member.membership} Member</strong></p>
        `;
            spotlightContainer.appendChild(card);
        });
    }

    getSpotlights();
}

// Weather Section
const weatherDescription = document.getElementById("weather-description");
const currentTemp = document.getElementById("current-temp");
const forecastContainer = document.getElementById("forecast");

if (weatherDescription && currentTemp && forecastContainer) {
    const apiKey = "5750ed886f0669bb2457406d66552837"; // <-- Your actual API key
    const city = "Accra";
    const units = "metric"; // Change to "imperial" for Fahrenheit
    const apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;

    async function getWeather() {
        try {
            const response = await fetch(apiURL);
            if (!response.ok) throw new Error("Failed to fetch weather data");
            const data = await response.json();

            // Current weather
            weatherDescription.textContent = `Weather: ${data.list[0].weather[0].description}`;
            currentTemp.textContent = `Temperature: ${data.list[0].main.temp}°C`;

            // 3-Day Forecast
            forecastContainer.innerHTML = "";
            for (let i = 8; i <= 32; i += 8) {
                const day = data.list[i];
                const li = document.createElement("li");
                const date = new Date(day.dt_txt);
                li.textContent = `${date.toLocaleDateString()}: ${day.main.temp}°C, ${day.weather[0].description}`;
                forecastContainer.appendChild(li);
            }
        } catch (error) {
            console.error("Error fetching weather:", error);
            weatherDescription.textContent = "Unable to load weather data.";
        }
    }

    getWeather();
}

// =======================
// Join Page Enhancements
// =======================
const joinForm = document.querySelector(".join-form");
if (joinForm) {
    // Set timestamp hidden field
    const tsField = document.getElementById("timestamp");
    if (tsField) {
        tsField.value = new Date().toISOString();
    }

    // Membership cards animation
    const cards = document.querySelectorAll(".membership-cards .card");
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add("show");
        }, index * 200); // staggered effect
    });

    // Modal functionality
    const modalLinks = document.querySelectorAll(".modal-link");
    const modals = document.querySelectorAll(".modal");

    modalLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const modalId = link.closest(".card").dataset.modal;
            const modal = document.getElementById(modalId);
            if (modal) modal.style.display = "block";
        });
    });

    // Close modals on X click
    modals.forEach(modal => {
        const closeBtn = modal.querySelector(".close");
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    });

    // Close on outside click
    window.addEventListener("click", (e) => {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            modals.forEach(modal => modal.style.display = "none");
        }
    });
}

/* ---------------- DISCOVER PAGE: fetch + render + last-visit ---------------- */
const discoverGrid = document.getElementById('discover-grid');

if (discoverGrid) {
    const DATA_URL = 'data/discover.json';

    async function loadDiscover() {
        try {
            const res = await fetch(DATA_URL);
            if (!res.ok) throw new Error('Discover JSON not found');
            const items = await res.json();
            renderDiscover(items);
        } catch (err) {
            console.error('Discover load error:', err);
            discoverGrid.innerHTML = '<p class="error">Unable to load places at this time.</p>';
        }
    }

    function renderDiscover(items) {
        discoverGrid.innerHTML = ''; // clear
        items.forEach((item) => {
            const card = document.createElement('article');
            card.className = 'card';
            card.setAttribute('tabindex', '0');

            card.innerHTML = `
        <figure>
          <img src="${item.image}" alt="${item.name} photo" loading="lazy" width="300" height="200">
        </figure>
        <div class="card-body">
          <h2>${item.name}</h2>
          <address>${item.address}</address>
          <p>${item.description}</p>
          <div class="card-actions">
            <button type="button" data-id="${item.id}" aria-label="Learn more about ${item.name}">Learn more</button>
          </div>
        </div>
      `;
            discoverGrid.appendChild(card);
        });

        // attach simple button listeners (could open modal or navigate)
        discoverGrid.querySelectorAll('.card-actions button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                // placeholder: could open modal with more details. For now, just alert (or you can implement modal)
                alert('Learn more: item id ' + id);
            });
        });
    }

    /* ---------- last-visit localStorage message ---------- */
    const lastVisitKey = 'accra-discover-last-visit';
    const lastVisitMsgEl = document.getElementById('last-visit-msg');
    const closeVisitBtn = document.getElementById('close-visit');

    function showLastVisitMessage() {
        const now = Date.now();
        const last = localStorage.getItem(lastVisitKey);
        if (!last) {
            lastVisitMsgEl.textContent = 'Welcome! Let us know if you have any questions.';
        } else {
            const msDiff = now - Number(last);
            const days = Math.floor(msDiff / (1000 * 60 * 60 * 24));
            if (days < 1) {
                lastVisitMsgEl.textContent = 'Back so soon! Awesome!';
            } else if (days === 1) {
                lastVisitMsgEl.textContent = 'You last visited 1 day ago.';
            } else {
                lastVisitMsgEl.textContent = `You last visited ${days} days ago.`;
            }
        }
        // update stored timestamp for next visit
        localStorage.setItem(lastVisitKey, now.toString());
    }

    if (lastVisitMsgEl) {
        showLastVisitMessage();
        if (closeVisitBtn) {
            closeVisitBtn.addEventListener('click', () => {
                document.getElementById('visit-banner').style.display = 'none';
            });
        }
    }

    // load data
    loadDiscover();
}

