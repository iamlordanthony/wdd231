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
    const apiKey = "101298823795781ac926393e77669e07"; // <--  API key
    const city = "Accra";
    const units = "metric"; // or "imperial" for Fahrenheit
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
            // OpenWeatherMap returns 3-hour intervals; pick roughly same time each day
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
