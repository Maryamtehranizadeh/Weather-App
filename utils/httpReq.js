import { showModal } from "./modal.js";

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = "e7fa362358981315c5aa15564cb8a35a";

const getWeatherData = async (type, data) => {
  let url = null;
  switch (type) {
    case "current":
      if (typeof data === "string") {
        url = `${BASE_URL}/weather?q=${data}&appid=${API_KEY}&units=metric`;
      } else {
        url = `${BASE_URL}/weather?lat=${data.latitude}&lon=${data.longitude}&appid=${API_KEY}&units=metric`;
      }
      break;
    case "forecast":
      if (typeof data === "string") {
        url = `${BASE_URL}/forecast?q=${data}&appid=${API_KEY}&units=metric`;
      } else {
        url = `${BASE_URL}/forecast?lat=${data.latitude}&lon=${data.longitude}&appid=${API_KEY}&units=metric`;
      }
      break;
    default:
      url = `${BASE_URL}/weather?lat=${data.lat}&lon=${data.lon}&appid=${API_KEY}&units=metric`;
      break;
  }

  try {
    const response = await fetch(url);
    const json = await response.json();
    if (+json.cod === 200) {
      return json;
    } else {
      showModal(json.message);
      return;
    }
  } catch (error) {
    showModal("Oooops! An error occured while fetching data!");
    return;
  }
};

export default getWeatherData;
