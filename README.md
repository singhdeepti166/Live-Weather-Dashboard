
# 🌤️ Live Weather Dashboard

A responsive weather dashboard built using HTML, CSS, and JavaScript that displays current weather conditions and a 5-day forecast for cities around the world.

## ✨ Features

- Search weather by city name.
- Live weather data using Open-Meteo API.
- Current temperature and weather conditions.
- Humidity and feels-like temperature.
- 5-day weather forecast.
- Friendly error messages.
- Loading state while fetching data.
- Remembers the last searched city using Local Storage.
- Responsive design for mobile and desktop.

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Fetch API
- Async/Await
- Open-Meteo Geocoding API
- Open-Meteo Forecast API
- Local Storage

## 🌐 API Used

Open-Meteo provides free weather data without requiring an API key.

- Geocoding: https://geocoding-api.open-meteo.com/
- Weather Forecast: https://open-meteo.com/

## 📁 Project Structure

```text
Live-Weather-Dashboard/
├── index.html
├── style.css
├── script.js
└── README.md
```

## 🚀 How to Run

1. Download or clone this repository.
2. Open the project folder in VS Code.
3. Run `index.html` using Live Server.
4. Enter a city name and click Search.

## ⚠️ Error Handling

- Empty input: asks the user to enter a city name.
- Invalid city: displays a city-not-found message.
- Network/API issue: displays a friendly error message.
- Search button is disabled while weather data is loading.

## 👩‍💻 Developer

Deepti Singh

GitHub: https://github.com/singhdeepti166

## 📄 License

This project is created for educational purposes.
