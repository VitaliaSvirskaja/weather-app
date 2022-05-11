import "./style.css";
import { getWeather, getWeatherByLongLat } from "./api";

async function displayWeather(city: string) {
  try {
    const finalWeather = await getWeather(city);
    console.log(finalWeather);
  } catch {
    console.log("City doesn't exist.");
  }
}

const searchbar = document.querySelector("#searchbar") as HTMLInputElement;
const searchButton = document.querySelector(".search-weather");
searchButton?.addEventListener("click", async () => {
  let city = searchbar.value;
  if (searchbar.value === "" && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    await displayWeather(city);
  }
});
searchbar.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    let city = searchbar.value;
    if (searchbar.value === "" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      await displayWeather(city);
    }
  }
});

async function showPosition(position: GeolocationPosition) {
  console.log(position);
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  const finalWeather = await getWeatherByLongLat(longitude, latitude);
  console.log(finalWeather);
}
