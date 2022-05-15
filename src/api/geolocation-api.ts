import { CityByPosition } from "../interfaces/city-by-position";

export async function getCityByPosition(latitude: number, longitude: number) {
  const response: Response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
  );
  const positionApiData: CityByPosition = await response.json();
  return positionApiData.address.city;
}
