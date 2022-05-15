import "./style.css";
import { getWeatherByCity, getWeatherByLongLat } from "./api/weather-api";
import { WeatherApiForecastData } from "./weather-api-forecast-data";
import { getCityByPosition } from "./api/geolocation-api";

//VARIABLES
let metric: "°C" | "°F" = "°C";
let weatherState: WeatherApiForecastData;
let city = "";

//SELECTORS
const searchbar = document.querySelector("#searchbar") as HTMLInputElement;
const searchButton = document.querySelector(".search-weather");
const unitToggleBtn = document.querySelector(".unit-toggle");
const currentTemperatur = document.querySelector(".current-temperatur");
const currentCity = document.querySelector(".current-city");
const currentWeatherDescription = document.querySelector(
  ".current-weather-description"
);
const todayHighLowTemperatur = document.querySelector(
  ".today-high-low-temperatur"
);
const feltTemperatur = document.querySelector(".felt-temperatur");
const sunrise = document.querySelector(".sunrise");
const sunset = document.querySelector(".sunset");

//EVENTLISTENERS
searchButton?.addEventListener("click", async () => {
  await handleSubmit();
});
searchbar.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    await handleSubmit();
  }
});

unitToggleBtn?.addEventListener("click", () => {
  metric = metric === "°C" ? "°F" : "°C";
  renderWeather();
  console.log(metric);
});

//FUNCTIONS

navigator.geolocation.getCurrentPosition(displayWeatherByPosition);

async function handleSubmit() {
  city = searchbar.value;
  if (city === "" && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(displayWeatherByPosition);
  } else {
    await displayWeatherByCity();
  }
}

async function displayWeatherByCity() {
  try {
    weatherState = await getWeatherByCity(city);
    console.log(weatherState);
    renderWeather();
    showWeatherByHour(weatherState);
  } catch {
    console.log("City doesn't exist.");
  }
}

async function displayWeatherByPosition(position: GeolocationPosition) {
  const { latitude, longitude } = position.coords;
  weatherState = await getWeatherByLongLat(longitude, latitude);
  city = await getCityByPosition(latitude, longitude);
  renderWeather();
  console.log(weatherState);
}

function renderWeather() {
  currentCity!.innerHTML = city.toUpperCase();
  const { feels_like, temp, weather } = weatherState.current;
  const { max, min } = weatherState.daily[0].temp;

  currentWeatherDescription!.innerHTML = weather[0].description;
  currentTemperatur!.innerHTML = Math.round(convert(temp)) + metric;
  todayHighLowTemperatur!.innerHTML =
    "H: " +
    Math.round(convert(max)) +
    metric +
    " / L: " +
    Math.round(convert(min)) +
    metric;
  feltTemperatur!.innerHTML = Math.round(convert(feels_like)) + metric;
  getSunriseTime(weatherState);
  getSunsetTime(weatherState);
}

function showWeatherByHour(weatherApiForecastData: WeatherApiForecastData) {
  const time = new Date(weatherApiForecastData.hourly[0].dt * 1000);
  const hours = time.getHours();
  const temperaturByHour = Math.round(
    weatherApiForecastData.hourly[0].temp
  ).toString();
  console.log(temperaturByHour + metric);
  console.log(hours);
}

//To Do Function "displayWeather erstellen, welche beim durchiterieren das Wetter im Frontend anzeigt (basierend auf hourly interface)

function getSunriseTime(weather: WeatherApiForecastData) {
  const sunriseTime = new Date(weather.daily[0].sunrise * 1000);
  let sunriseHour = sunriseTime.getHours().toString();
  let sunriseMinutes = sunriseTime.getMinutes().toString();
  if (sunriseTime.getHours() < 10) {
    sunriseHour = "0" + sunriseTime.getHours().toString();
  }
  if (sunriseTime.getMinutes() < 10) {
    sunriseMinutes = "0" + sunriseTime.getMinutes().toString();
  }
  sunrise!.innerHTML = sunriseHour + ":" + sunriseMinutes;
}

function getSunsetTime(weather: WeatherApiForecastData) {
  const sunsetTime = new Date(weather.daily[0].sunset * 1000);
  let sunsetHour = sunsetTime.getHours().toString();
  let sunsetMinutes = sunsetTime.getMinutes().toString();
  if (sunsetTime.getHours() < 10) {
    sunsetHour = "0" + sunsetTime.getHours().toString();
  }
  if (sunsetTime.getMinutes() < 10) {
    sunsetMinutes = "0" + sunsetTime.getMinutes().toString();
  }
  sunset!.innerHTML = sunsetHour + ":" + sunsetMinutes;
}

function convert(celsius: number): number {
  if (metric === "°F") {
    return celsius * (9 / 5) + 32;
  } else {
    return celsius;
  }
}
