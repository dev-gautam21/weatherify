const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city');
const rightInfo = document.querySelector('.right-info ul');
const pic = document.querySelector('.pic');
const forecastContainer = document.getElementById('forecast-items');
const apiKey = '4e368bcf3d430ffb195fb7445178a9c6';


async function fetchWeather(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('City not found');
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert(error.message);
    }
}


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const data = await fetchWeather(url);
    if (data) updateWeatherInfo(data);
});


document.getElementById('get-location').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
                const data = await fetchWeather(url);
                if (data) updateWeatherInfo(data);
            },
            () => alert('Unable to retrieve your location')
        );
    } else {
        alert('Geolocation is not supported by your browser');
    }
});


function getFourDayForecast(list) {
    const forecastsByDay = {};
    const today = new Date().getDate(); // Get the current day of the month

    list.forEach((forecast) => {
        const date = new Date(forecast.dt_txt);
        const day = date.getDate(); // Get the forecast day of the month

        // Skip current day and group forecasts by unique day
        if (day !== today && (!forecastsByDay[day] || forecast.dt_txt.includes("12:00:00"))) {
            forecastsByDay[day] = {
                temp: Math.round(forecast.main.temp),
                day: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }),
                icon: forecast.weather[0].icon,
                description: forecast.weather[0].description,
            };
        }
    });

    return Object.values(forecastsByDay).slice(0, 5);
}

function updateWeatherInfo(data) {
    const cityName = data.city?.name || data.name;
    const country = data.city?.country || data.sys?.country;
    const currentWeather = data.list ? data.list[0] : data;
    const temp = `${Math.round(currentWeather.main.temp)}°C`;
    const humidity = `${currentWeather.main.humidity}%`;
    const windSpeed = `${currentWeather.wind.speed} km/h`;
    const description = currentWeather.weather[0].description;
    const capitalizedDescription = description.charAt(0).toUpperCase() + description.slice(1);
    const iconCode = currentWeather.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    
    pic.classList.remove('hide');
    

    
    rightInfo.innerHTML = `
        <li>${cityName}, ${country}</li>
        <li>${temp}</li>
        <li>${humidity}</li>
        <li>${windSpeed}</li>
    `;

    
    document.getElementById('weather-desc').innerText = capitalizedDescription;
    document.getElementById('temp-display').innerText = temp;
    document.getElementById('date-display').innerText = date;

    // Update weather icon
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;


    if (data.list) {
        const dailyForecasts = getFourDayForecast(data.list);

        forecastContainer.innerHTML = dailyForecasts.map((forecast) => `
            <div class="forecast-item">
                <img src="http://openweathermap.org/img/wn/${forecast.icon}@2x.png" alt="${forecast.description}">
                <p>${forecast.temp}°C</p>
                <p>${forecast.day}</p>
            </div>
        `).join('');
}
forecastContainer.parentElement.classList.remove('hide');
}
