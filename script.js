const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city');
const rightInfo = document.querySelector('.right-info ul');
const pic = document.querySelector('.pic');
const apiKey = '4e368bcf3d430ffb195fb7445178a9c6';  

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const city = cityInput.value.trim();
    if (!city) return;

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        updateWeatherInfo(data);
    } catch (error) {
        alert(error.message);
    }
});


function fetchWeatherByLocation(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                updateWeatherInfo(data);
            } else {
                alert('Unable to fetch weather data for your location');
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

// Event listener for the "Use My Location" button
document.getElementById('get-location').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByLocation(lat, lon);  // Fetch weather based on geolocation
        }, (error) => {
            alert('Unable to retrieve your location');
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
});

function updateWeatherInfo(data) {
    const name = data.name;
    const temp = `${Math.round(data.main.temp)}°C`;
    const humidity = `${data.main.humidity}%`;
    const windSpeed = `${data.wind.speed} km/h`;
    const description = data.weather[0].description;
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    pic.classList.remove('hide');

    // Update Right Info Panel
    rightInfo.innerHTML = `
        <li>${name}</li>
        <li>${temp}</li>
        <li>${humidity}</li>
        <li>${windSpeed}</li>
    `;

    // Update Main Display in 'pic'
    document.getElementById('weather-desc').innerText = description;
    document.getElementById('temp-display').innerText = temp;
    document.getElementById('date-display').innerText = date;
}
