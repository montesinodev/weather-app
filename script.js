const apiKey = "98caee5e9cc88cbfe57f5c7e7a5cf296";
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");

searchBtn.addEventListener("click", getWeather);
cityInput.addEventListener("keypress", e => { if (e.key === "Enter") getWeather(); });

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    displayWeather(data);
  } catch (err) {
    weatherResult.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

function displayWeather(data) {
  const { name } = data;
  const { temp, humidity } = data.main;
  const { description, icon, main: weatherMain } = data.weather[0];
  const { speed } = data.wind;

  // Change background
  document.body.className = ""; 
  switch (weatherMain.toLowerCase()) {
    case "clear": document.body.classList.add("sunny"); break;
    case "clouds": document.body.classList.add("cloudy"); break;
    case "rain": case "drizzle": document.body.classList.add("rainy"); break;
    case "snow": document.body.classList.add("snowy"); break;
    default: document.body.classList.add("default-weather");
  }

  // Render new content
  weatherResult.innerHTML = `
    <div class="weather-card">
      <h2>${name}</h2>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
      <p>${description}</p>
      <p id="temp">🌡 Temperature: ${temp} °C</p>
      <p>💧 Humidity: ${humidity}%</p>
      <p>💨 Wind Speed: ${speed} m/s</p>
      <button id="toggleTemp">Show °F</button>
    </div>
  `;

  // Always attach new event listener to the new button
  const toggleBtn = document.getElementById("toggleTemp");
  let isCelsius = true;

  toggleBtn?.addEventListener("click", () => {
    const tempElement = document.getElementById("temp");
    if (!tempElement) return; // Safety check

    if (isCelsius) {
      const fahrenheit = (temp * 9/5 + 32).toFixed(1);
      tempElement.textContent = `🌡 Temperature: ${fahrenheit} °F`;
      toggleBtn.textContent = "Show °C";
    } else {
      tempElement.textContent = `🌡 Temperature: ${temp} °C`;
      toggleBtn.textContent = "Show °F";
    }
    isCelsius = !isCelsius;
  });
}

