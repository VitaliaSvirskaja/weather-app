import "./style.css";
import { getWeatherByCity, getWeatherByLongLat } from "./api/weather-api";
import { WeatherApiForecastData } from "./weather-api-forecast-data";
import { getCityByPosition } from "./api/geolocation-api";

//SELECTORS
const searchbar = document.querySelector("#searchbar") as HTMLInputElement;
const searchButton = document.querySelector(".search-weather");
const currentTemperatur = document.querySelector(".current-temperatur");
const currentCity = document.querySelector(".current-city");
const currentWeatherDescription = document.querySelector(
  ".current-weather-description"
);
const todayHighLowTemperatur = document.querySelector(
  ".today-high-low-temperatur"
);

//EVENTLISTENERS
searchButton?.addEventListener("click", async () => {
  await handleSubmit();
});
searchbar.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    await handleSubmit();
  }
});

//FUNCTIONS
async function handleSubmit() {
  let city = searchbar.value;
  if (city === "" && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(displayWeatherByPosition);
  } else {
    await displayWeatherByCity(city);
  }
}

async function displayWeatherByCity(city: string) {
  try {
    const weather = await getWeatherByCity(city);
    console.log(weather);
    showCurrentWeatherData(weather, city);
    showWeatherByHour(weather);
  } catch {
    console.log("City doesn't exist.");
  }
}

async function displayWeatherByPosition(position: GeolocationPosition) {
  const { latitude, longitude } = position.coords;
  const weather = await getWeatherByLongLat(longitude, latitude);
  const city = await getCityByPosition(latitude, longitude);
  showCurrentWeatherData(weather, city);
  console.log(weather);
}

function showCurrentWeatherData(weather: WeatherApiForecastData, city: string) {
  currentCity!.innerHTML = city.toUpperCase();
  currentWeatherDescription!.innerHTML = weather.current.weather[0].description;
  currentTemperatur!.innerHTML =
    Math.round(weather.current.temp).toString() + "°";
  todayHighLowTemperatur!.innerHTML =
    "H: " +
    Math.round(weather.daily[0].temp.max).toString() +
    "° / L: " +
    Math.round(weather.daily[0].temp.min).toString() +
    "°";
}

function showWeatherByHour(weather: WeatherApiForecastData) {
  const time = new Date(weather.hourly[0].dt * 1000);
  const hours = time.getHours();
  const temperaturByHour = Math.round(weather.hourly[0].temp).toString();
  console.log(temperaturByHour + "°");
  console.log(hours);
}

//To Do Function "displayWeather erstellen, welche beim durchiterieren das Wetter im Frontend anzeigt (basierend auf hourly interface)
