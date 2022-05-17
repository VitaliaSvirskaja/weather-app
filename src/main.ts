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
const forecastContainer = document.querySelector(".forecast");
const loader = document.querySelector(".loader") as HTMLDivElement;

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
  } catch {
    console.log("City doesn't exist.");
  }
}

async function displayWeatherByPosition(position: GeolocationPosition) {
  const { latitude, longitude } = position.coords;
  weatherState = await getWeatherByLongLat(longitude, latitude);
  city = await getCityByPosition(latitude, longitude);
  loader.style.visibility = "hidden";
  renderWeather();
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
  showWeatherByHour(weatherState);
}

function showWeatherByHour(weatherApiForecastData: WeatherApiForecastData) {
  const hourlyWeather = weatherApiForecastData.hourly.slice(0, 13);
  forecastContainer!.innerHTML = "";
  hourlyWeather.forEach((weatherByHour) => {
    const time = new Date(weatherByHour.dt * 1000);
    const hours = time.getHours();
    const hourlyTemperatur = Math.round(convert(weatherByHour.temp)).toString();
    const weatherImage = weatherByHour.weather[0].icon;
    console.log(hourlyTemperatur + metric);
    console.log(hours);
    displayWeatherByHour(hours, hourlyTemperatur, weatherImage);
  });
}

function displayWeatherByHour(
  hours: number,
  hourlyTemperatur: string,
  weatherImage: string
) {
  const weatherByHourTemplate = document.querySelector(
    "#weatherByHour-template"
  ) as HTMLTemplateElement;
  const weatherByHour = document.createElement("div");
  weatherByHour.append(weatherByHourTemplate.content.cloneNode(true));
  if (hours < 10) {
    weatherByHour.querySelector(".hour")!.textContent = "0" + hours.toString();
  } else {
    weatherByHour.querySelector(".hour")!.textContent = hours.toString();
  }
  weatherByHour.querySelector(".temperaturByHour")!.textContent =
    hourlyTemperatur + metric;
  const weatherIcon = weatherByHour.querySelector(
    "#weatherIcon"
  ) as HTMLImageElement;
  weatherIcon.src = `http://openweathermap.org/img/wn/${weatherImage}@2x.png`;
  forecastContainer?.append(weatherByHour);
}

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
