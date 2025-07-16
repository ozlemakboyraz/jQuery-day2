$(document).ready(function() {

    const API_KEY = 'c6ebd1d75d34d0347a073d3b22ad0cf8';
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

    const $cityInput = $('#cityInput');
    const $getWeatherBtn = $('#getWeatherBtn');
    const $weatherDisplay = $('#weatherDisplay');
    const $forecastDisplay = $('#forecastDisplay');
    const $loadingIndicator = $('#loading');
    const $errorMessage = $('#errorMessage');


    function getWeatherData(city) {
        if (!city) {
            $errorMessage.text('Lütfen bir şehir adı girin.').show();
            return;
        }

     
        $weatherDisplay.empty();
        $forecastDisplay.empty();
        $('.initial-message').hide();
        $errorMessage.hide();
        $loadingIndicator.show();

   
        const currentWeatherUrl = `${BASE_URL}weather?q=${city}&appid=${API_KEY}&units=metric&lang=tr`;
        const forecastUrl = `${BASE_URL}forecast?q=${city}&appid=${API_KEY}&units=metric&lang=tr`;

        
        $.when(
            $.get(currentWeatherUrl),
            $.get(forecastUrl)
        )
        .then(function(currentDataResponse, forecastDataResponse) {
            $loadingIndicator.hide();
            
            const currentData = currentDataResponse[0]; 
            const forecastData = forecastDataResponse[0]; 

            displayCurrentWeather(currentData);
            displayForecast(forecastData);

        }, function(jqXHR, textStatus, errorThrown) {
            $loadingIndicator.hide();
            if (jqXHR.status === 404) {
                $errorMessage.text('Belirtilen şehir bulunamadı. Lütfen kontrol edin.').show();
            } else {
                $errorMessage.text('Hava durumu bilgileri alınırken bir hata oluştu.').show();
                console.error("API Hatası:", textStatus, errorThrown);
            }
        });
    }


    function displayCurrentWeather(data) {
        const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        const description = data.weather[0].description;

        const weatherHtml = `
            <div class="current-weather">
                <h2>${data.name}, ${data.sys.country}</h2>
                <p>
                    <img src="${weatherIcon}" alt="${description}"> 
                    ${description.charAt(0).toUpperCase() + description.slice(1)}
                </p>
                <p class="temperature">${Math.round(data.main.temp)}°C</p>
                <div class="details">
                    <p>Hissedilen: ${Math.round(data.main.feels_like)}°C</p>
                    <p>Nem: ${data.main.humidity}%</p>
                    <p>Rüzgar Hızı: ${data.wind.speed} m/s</p>
                </div>
            </div>
        `;
        $weatherDisplay.html(weatherHtml);
    }


    function displayForecast(data) {
        $forecastDisplay.append('<h2>5 Günlük Tahmin</h2>');
        const forecastGrid = $('<div class="forecast-grid"></div>');
        
       
        const dailyForecasts = {};
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const day = date.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' });
            const hour = date.getHours();

            if (!dailyForecasts[day] && hour >= 12 && hour <= 18) {
                dailyForecasts[day] = item;
            }
        });

        for (const day in dailyForecasts) {
            const item = dailyForecasts[day];
            const date = new Date(item.dt * 1000);
            const weatherIcon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
            const description = item.weather[0].description;

            forecastGrid.append(`
                <div class="forecast-item">
                    <h4>${date.toLocaleDateString('tr-TR', { weekday: 'short'})}</h4>
                    <img src="${weatherIcon}" alt="${description}">
                    <p class="temp">${Math.round(item.main.temp)}°C</p>
                    <p class="desc">${description}</p>
                </div>
            `);
        }
        $forecastDisplay.append(forecastGrid);
    }


    $getWeatherBtn.on('click', function() {
        const city = $cityInput.val().trim();
        getWeatherData(city);
    });

    $cityInput.on('keypress', function(e) {
        if (e.which === 13) { 
            const city = $cityInput.val().trim();
            getWeatherData(city);
        }
    });
});