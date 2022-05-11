import { Weather } from "./weather-interface";
import { apiKey } from "./weather-api-key";
import { WeatherApiData } from "./weather-api-data";
import { mapWeatherData } from "./weather-mapping";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function getWeather(city: string): Promise<Weather> {
  const url = new URL(BASE_URL);
  url.searchParams.append("q", city);
  url.searchParams.append("APPID", apiKey);
  url.searchParams.append("units", "metric");
  url.searchParams.append("lang", "de");
  let response: Response = await fetch(url.toString(), {
    mode: "cors",
  });
  let weatherData: WeatherApiData = await response.json();
  return mapWeatherData(weatherData);
}

export async function getWeatherByLongLat(longitude: number, latitude: number) {
  const url = new URL(BASE_URL);
  url.searchParams.append("lat", latitude.toString());
  url.searchParams.append("lon", longitude.toString());
  url.searchParams.append("appid", apiKey);
  url.searchParams.append("lang", "de");
  let response: Response = await fetch(url.toString(), {
    mode: "cors",
  });
  let weatherData: WeatherApiData = await response.json();
  return mapWeatherData(weatherData);
}
