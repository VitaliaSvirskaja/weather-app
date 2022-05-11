import "./style.css";
import { getWeather, getWeatherByLongLat } from "./api";

const searchbar = document.querySelector("#searchbar") as HTMLInputElement;
const searchButton = document.querySelector(".search-weather");

searchButton?.addEventListener("click", async () => {
  await handleSubmit();
});
searchbar.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    await handleSubmit();
  }
});

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
    const weather = await getWeather(city);
    console.log(weather);
  } catch {
    console.log("City doesn't exist.");
  }
}

async function displayWeatherByPosition(position: GeolocationPosition) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  const weather = await getWeatherByLongLat(longitude, latitude);
  console.log(weather);
}
