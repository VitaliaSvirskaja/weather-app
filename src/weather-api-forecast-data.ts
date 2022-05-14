interface Weather {
  description: string;
  icon: string;
}

interface Hourly {
  dt: number;
  temp: number;
  feels_like: number;
  weather: Array<Weather>;
}

interface Daily {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: {
    day: number;
  };
  weather: Array<Weather>;
}

export interface WeatherApiForecastData {
  lat: number;
  lon: number;
  current: {
    temp: number;
    feels_like: number;
    weather: Array<Weather>;
  };
  hourly: Array<Hourly>;
  daily: Array<Daily>;
}
