import { apiKey } from "../weather-api-key";
import { WeatherApiForecastData } from "../weather-api-forecast-data";
import { WeatherApiData } from "../interfaces/weather-api-data";
import { Position } from "../interfaces/position";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

async function getPositionByCityName(city: string): Promise<Position> {
  const url = new URL(BASE_URL + "/weather");
  url.searchParams.append("q", city);
  url.searchParams.append("APPID", apiKey);
  url.searchParams.append("units", "metric");
  url.searchParams.append("lang", "de");
  let weatherByCityResponse: Response = await fetch(url.toString(), {
    mode: "cors",
  });
  const weatherApiData: WeatherApiData = await weatherByCityResponse.json();
  return {
    longitude: weatherApiData.coord.lon,
    latitude: weatherApiData.coord.lat,
  };
}

export async function getWeatherByCity(
  city: string
): Promise<WeatherApiForecastData> {
  const { latitude, longitude } = await getPositionByCityName(city);
  return getWeatherByLongLat(longitude, latitude);
}

export async function getWeatherByLongLat(
  longitude: number,
  latitude: number
): Promise<WeatherApiForecastData> {
  const url = new URL(BASE_URL + "/onecall");
  url.searchParams.append("lat", latitude.toString());
  url.searchParams.append("lon", longitude.toString());
  url.searchParams.append("appid", apiKey);
  url.searchParams.append("lang", "de");
  url.searchParams.append("units", "metric");
  url.searchParams.append("exclude", "minutely, alerts");
  const response: Response = await fetch(url.toString(), {
    mode: "cors",
  });
  return response.json();
}
