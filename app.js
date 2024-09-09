// $(document).ready(function () {
const apiKey="0fc205821f924332ac352649240609"

document.getElementById('search-btn').addEventListener('click', function () {
    const location = document.getElementById('location-input').value;
    fetchWeatherData(location);
});

function fetchWeatherData(location) {
    const apiKey = '0fc205821f924332ac352649240609';
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7`)
        .then(response => response.json())
        .then(data => {
            updateWeatherUI(data);
            const timezone = data.location.tz_id;
            startClock(timezone);
        })
        .catch(error => console.error('Error fetching the weather data:', error));
}

function updateWeatherUI(data) {
    const location = data.location;
    document.getElementById('city').innerText = location.name;

    const current = data.current;
    document.getElementById('icontemp').src = current.condition.icon;
    document.getElementById('temp').innerText = `${current.temp_c}°C`;
    document.getElementById('icontemp').alt = current.condition.text;
    document.getElementById('weather-desc').innerText = current.condition.text;
    document.getElementById('sunrise').innerText = ` ${data.forecast.forecastday[0].astro.sunrise}`;
    document.getElementById('sunset').innerText = ` ${data.forecast.forecastday[0].astro.sunset}`;
    document.getElementById('humidity').innerText = `${current.humidity} Rain%`;
    document.getElementById('wind-speed').innerText = `${current.wind_kph} km/h`;
    document.getElementById('direction').innerText = `${current.wind_dir} `;

    
     const forecastDays = data.forecast.forecastday.slice(0, 6); 
     const forecastContainer = document.getElementById('forecast-container'); 
 
     forecastContainer.innerHTML = ''; 
 
     forecastDays.forEach((day, index) => {
         const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' });
         const temp = day.day.avgtemp_c;
         const icon = day.day.condition.icon;
         const rainChance = day.day.daily_chance_of_rain;
         const windSpeed = day.day.maxwind_kph;
         const windDir = day.day.wind_dir;
 
         const forecastHTML = `
             <div class="col day-card">
                 <h5>${dayName}</h5>
                 <p>${temp}°C</p>
                 <p>${day.day.condition.text}</p>
                 <img src="${icon}" alt="">
                 <p>${rainChance}% Rain <h3><i class="bi bi-umbrella"></i></h3></p>
                 <p>${windSpeed} km/h <h3><i class="bi bi-wind"></i></h3></p>
                 
             </div>
         `;
 
         forecastContainer.innerHTML += forecastHTML; 
     });

}


function startClock(timezone) {
    updateTime(timezone);
    clearInterval(window.clockInterval);
    window.clockInterval = setInterval(() => {
        updateTime(timezone);
    }, 1000);
} 
function updateTime(timezone) {
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    const now = new Date();

    const options = { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dateOptions = { timeZone: timezone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeString = now.toLocaleTimeString('en-US', options);
    const dateString = now.toLocaleDateString('en-US', dateOptions);

    timeElement.innerText = timeString;
    dateElement.innerText = dateString;
}





function fetchCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherData(`${lat},${lon}`);
        }, error => {
            console.error('Error getting location:', error);
            fetchWeatherData('Colombo');
        });
    } else {
        fetchWeatherData('Colombo');
    }
}

fetchCurrentLocationWeather();

   