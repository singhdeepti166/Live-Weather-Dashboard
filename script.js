
const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const statusText = document.getElementById("status");
const currentWeather = document.getElementById("current-weather");
const forecastContainer = document.getElementById("forecast");

const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Freezing drizzle",
    57: "Heavy freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Heavy thunderstorm with hail"
};

function getWeatherDescription(code) {
    return weatherCodes[code] || "Unknown conditions";
}

async function findCity(name) {
    const url = `${GEOCODING_API}?name=${encodeURIComponent(name)}&count=1&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to search for this city.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("City not found. Please check the spelling.");
    }

    return data.results[0];
}

async function getWeather(latitude, longitude) {
    const params = new URLSearchParams({
        latitude,
        longitude,
        current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code",
        daily: "weather_code,temperature_2m_max,temperature_2m_min",
        timezone: "auto",
        forecast_days: "5"
    });

    const response = await fetch(`${WEATHER_API}?${params}`);

    if (!response.ok) {
        throw new Error("Unable to fetch weather data.");
    }

    return await response.json();
}

function createElement(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
}

function displayCurrentWeather(city, weather) {
    const current = weather.current;

    currentWeather.replaceChildren();

    const cityName = createElement(
        "h2",
        "weather-city",
        `${city.name}, ${city.country}`
    );

    const condition = createElement(
        "p",
        "weather-condition",
        getWeatherDescription(current.weather_code)
    );

    const temperature = createElement(
        "p",
        "temperature",
        `${Math.round(current.temperature_2m)}°C`
    );

    const details = createElement("div", "weather-details", "");

    details.append(
        createElement(
            "p",
            "",
            `Feels like: ${Math.round(current.apparent_temperature)}°C`
        ),
        createElement(
            "p",
            "",
            `Humidity: ${current.relative_humidity_2m}%`
        )
    );

    currentWeather.append(cityName, condition, temperature, details);
}

function displayForecast(weather) {
    const daily = weather.daily;

    forecastContainer.replaceChildren();

    daily.time.forEach((date, index) => {
        const card = createElement("article", "forecast-card", "");

        const formattedDate = new Date(
            `${date}T00:00:00`
        ).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });

        const heading = createElement("h3", "", formattedDate);

        const condition = createElement(
            "p",
            "forecast-condition",
            getWeatherDescription(daily.weather_code[index])
        );

        const temperatures = createElement(
            "p",
            "forecast-temperatures",
            ""
        );

        const high = createElement(
            "span",
            "high",
            `High: ${Math.round(daily.temperature_2m_max[index])}°C`
        );

        const low = createElement(
            "span",
            "low",
            `Low: ${Math.round(daily.temperature_2m_min[index])}°C`
        );

        temperatures.append(high, document.createTextNode(" | "), low);
        card.append(heading, condition, temperatures);
        forecastContainer.append(card);
    });
}

async function searchWeather(cityName) {
    const city = await findCity(cityName);
    const weather = await getWeather(city.latitude, city.longitude);

    displayCurrentWeather(city, weather);
    displayForecast(weather);

    statusText.textContent = "Weather updated successfully!";

    try {
        localStorage.setItem("lastCity", cityName);
    } catch (error) {
        console.warn("Could not save the last city.");
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const cityName = cityInput.value.trim();

    if (!cityName) {
        statusText.textContent = "Please enter a city name.";
        return;
    }

    searchBtn.disabled = true;
    statusText.textContent = "Loading weather...";
    currentWeather.replaceChildren();
    forecastContainer.replaceChildren();

    try {
        await searchWeather(cityName);
    } catch (error) {
        statusText.textContent = error.message.includes("City not found")
            ? error.message
            : "Network problem. Please check your connection and try again.";

        currentWeather.replaceChildren();
        forecastContainer.replaceChildren();
    } finally {
        searchBtn.disabled = false;
    }
});

try {
    const lastCity = localStorage.getItem("lastCity");

    if (lastCity) {
        cityInput.value = lastCity;
        searchWeather(lastCity).catch(() => {
            statusText.textContent = "Search for a city to see its weather.";
        });
    }
} catch (error) {
    console.warn("Local storage is unavailable.");
}
