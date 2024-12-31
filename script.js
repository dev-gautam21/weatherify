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

    rightInfo.innerHTML = `
        <li>${name}</li>
        <li>${temp}</li>
        <li>${humidity}</li>
        <li>${windSpeed}</li>
    `;
}
