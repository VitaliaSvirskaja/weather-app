import { Weather } from "./weather-interface";
import { WeatherApiData } from "./weather-api-data";

export function mapWeatherData(weatherData: WeatherApiData): Weather {
  return {
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
}
