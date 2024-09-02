import getWeatherData from "./utils/httpReq.js";
import { showModal } from "./utils/modal.js";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Satuarday",
];

const searchInput = document.querySelector("input");
const searchButton = document.querySelector("button");
const weatherContainer = document.getElementById("weather");
const locationIcon = document.getElementById("location");
const forecastContainer = document.getElementById("forecast");

const renderCurrentweather = (data) => {
  if (!data) {
    return;
  }
  searchInput.value = data.name;
  const weatherJSX = `
  <h1>${data.name}, ${data.sys.country}</h1>
  <div id="main">
    <img alt="wather icon" src="https://openweathermap.org/img/wn/${
      data.weather[0].icon
    }.png"/>
    <span>${data.weather[0].main} </span>
    <p>${Math.round(data.main.temp)}°C</p>

  </div>
  <div id="info">
    <p>Humidity: <span>${data.main.humidity}%</span></p>
    <p>Wind Speed: <span>${data.wind.speed} m/s</span> </p>
  </div>
  `;

  weatherContainer.innerHTML = weatherJSX;
};

const renderForecastWeather = (data) => {
  if (!data) {
    return;
  }
  forecastContainer.innerHTML = "";
  const myList = data.list.filter((object) =>
    object.dt_txt.endsWith("12:00:00")
  );
  myList.forEach((object) => {
    console.log(object);
    const forecastJSX = `
    <div>
        <h3>${DAYS[new Date(object.dt * 1000).getDay()]}</h3>
        <img alt="wather icon" src="https://openweathermap.org/img/wn/${
          object.weather[0].icon
        }.png"/>
        <p>${object.weather[0].main}</p>
        <span>${Math.round(object.main.temp)}°C</span>
    </div>
    `;
    forecastContainer.innerHTML += forecastJSX;
  });
};
const searchHandler = async () => {
  weatherContainer.innerHTML = `<span id="loader"></span>`;
  const cityName = searchInput.value;
  if (!cityName) {
    showModal("Please enter a valid city!");
    return;
  } else {
    const currentData = await getWeatherData("current", cityName);
    const forecastData = await getWeatherData("forecast", cityName);
    renderCurrentweather(currentData);
    renderForecastWeather(forecastData);
  }
};
const positionCallBack = async (position) => {
  const currentData = await getWeatherData("current", position.coords);
  const forecastData = await getWeatherData("forecast", position.coords);
  renderCurrentweather(currentData);
  renderForecastWeather(forecastData);
};
const errorCallBack = (error) => {
  showModal(error.message);
};
const locationHandler = async () => {
  weatherContainer.innerHTML = `<span id="loader"></span>`;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCallBack, errorCallBack);
  } else {
    showModal("Your browser does not support geolocation!");
  }
};

const initHandler = async () => {
  await locationHandler();
};

searchButton.addEventListener("click", searchHandler);
searchInput.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    searchHandler();
  }
});
locationIcon.addEventListener("click", locationHandler);
document.addEventListener("DOMContentLoaded", initHandler);
