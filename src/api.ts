import { Weather } from "./weather-interface";
import { apiKey } from "./weather-api-key";
import { WeatherApiData } from "./weather-api-data";

export async function getWeather(city: string): Promise<Weather> {
  let response: Response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=metric&lang=de`,
    {
      mode: "cors",
    }
  );
  let weatherData: WeatherApiData = await response.json();
  const weatherByName: Weather = {
    location: weatherData.name,
    temperatur: weatherData.main.temp,
    minTemperatur: weatherData.main.temp_min,
    maxTemperatur: weatherData.main.temp_max,
    feltTemperatur: weatherData.main.feels_like,
    sunrise: weatherData.sys.sunrise,
    sunset: weatherData.sys.sunset,
    longitude: weatherData.coord.lon,
    latitude: weatherData.coord.lat,
  };
  return weatherByName;
}

export async function getWeatherByLongLat(longitude: number, latitude: number) {
  let response: Response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=de`,
    {
      mode: "cors",
    }
  );
  let weatherData: WeatherApiData = await response.json();
  const weatherByPosition: Weather = {
    location: weatherData.name,
    temperatur: weatherData.main.temp,
    minTemperatur: weatherData.main.temp_min,
    maxTemperatur: weatherData.main.temp_max,
    feltTemperatur: weatherData.main.feels_like,
    sunrise: weatherData.sys.sunrise,
    sunset: weatherData.sys.sunset,
    longitude: weatherData.coord.lon,
    latitude: weatherData.coord.lat,
  };
  return weatherByPosition;
}
