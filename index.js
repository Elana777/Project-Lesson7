function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastHTML = "";

  forecast.forEach(function (day, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
        <div class="weather-forecast-day">
          <div class="weather-forecast-date">
            ${formatDay(day.time)}
          </div>

          <img
            src="${day.condition.icon_url}"
            class="weather-forecast-icon"
          />

          <div class="weather-forecast-temperatures">
            <span class="weather-forecast-temperature">
              <strong>${Math.round(day.temperature.maximum)}°</strong>
            </span>

            <span class="weather-forecast-temperature">
              ${Math.round(day.temperature.minimum)}°
            </span>
          </div>
        </div>
      `;
    }
  });

  document.querySelector("#forecast").innerHTML = forecastHTML;
}

function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let iconElement = document.querySelector("#icon");

  let temperature = response.data.temperature.current;
  let date = new Date(response.data.time * 1000);

  cityElement.innerHTML = response.data.city;
  temperatureElement.innerHTML = Math.round(temperature);
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed} km/h`;
  timeElement.innerHTML = formatDate(date);

  iconElement.innerHTML = `
    <img
      src="${response.data.condition.icon_url}"
      class="weather-app-icon"
    />
  `;
}

function searchCity(city) {
  let apiKey = "a72f8td8doa865310061aa8288234cb4";

  let currentUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;

  let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}`;

  axios.get(currentUrl).then(refreshWeather);
  axios.get(forecastUrl).then(displayForecast);
}

function handleSearchSubmit(event) {
  event.preventDefault();

  let searchInput = document.querySelector("#search-form-input");

  searchCity(searchInput.value);
}

let searchFormElement = document.querySelector("#search-form");

searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Paris");
