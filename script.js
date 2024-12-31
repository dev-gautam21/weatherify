const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city');
const rightInfo = document.querySelector('.right-info ul');

const apiKey = '4e368bcf3d430ffb195fb7445178a9c6'; 

form.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const city = cityInput.value.trim(); 
    if (!city) 
    return; 

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


function updateWeatherInfo(data) {
    const name = data.name;
    const temp = `${Math.round(data.main.temp)}°C`;
    const humidity = `${data.main.humidity}%`;
    const windSpeed = `${data.wind.speed} km/h`;
    const description = data.weather[0].description;
    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    // Update Right Info Panel
    rightInfo.innerHTML = `
        <li>${name}</li>
        <li>${temp}</li>
        <li>${humidity}</li>
        <li>${windSpeed}</li>
    `;
<<<<<<< HEAD

    // Update Main Display in 'pic'
    document.getElementById('weather-desc').innerText = description;
    document.getElementById('temp-display').innerText = temp;
    document.getElementById('date-display').innerText = date;
}
=======
}

>>>>>>> a8b7e2bb413ed04a634cb2369f50008e1d93c66b
