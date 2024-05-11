// WEATHER APP

const weatherForm = document.querySelector(".weatherForm");
const cityInput =  document.querySelector(".cityInput");
const card =  document.querySelector(".card");
const apiKey = "e0c9902b3507bf1f952f891d5251103b";

weatherForm.addEventListener("submit", async event => {

    event.preventDefault();
    
    const city = cityInput.value;

    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Please input a city");
    }

});

async function getWeatherData(city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    console.log(response);

    if(!response.ok){
        throw new Error("Could not fetch weather data");
    }

    return await response.json();
}

function displayWeatherInfo(data){
    const {name: city, main: {temp, humidity}, weather: [{description, id}], timezone: timezone} = data;
    var date = new Date();
    var hourOffset = timezone/3600;
    var cityMinutes = date.getUTCMinutes();
    var cityHours = date.getUTCHours();
    var cityTime;

    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("p");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");
    const timeDisplay = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent =  getWeatherEmoji(id);
    if(hourOffset % 1 == 0){
        cityTime = date.getUTCHours()+hourOffset+":"+
                                date.getUTCMinutes();
        timeDisplay.textContent = cityTime;
    }
    else if(hourOffset % 0.5 == 0){
        if(cityMinutes > 30){
            if(cityHours + hourOffset > 23){
                hourOffset = Math.floor(hourOffset);
                cityTime = (date.getUTCHours()+hourOffset-24)+":"+
                                        (date.getUTCMinutes()-30);
                timeDisplay.textContent = cityTime;
            } else{
                hourOffset = Math.floor(hourOffset);
                cityTime = date.getUTCHours()+hourOffset+":"+
                                        (date.getUTCMinutes()-30);
                timeDisplay.textContent = cityTime;
            }
        }
        else {
            if(cityHours + hourOffset > 23){
                hourOffset = Math.floor(hourOffset);
                cityTime = (date.getUTCHours()+hourOffset-24)+":"+
                                        (date.getUTCMinutes()+30);
                timeDisplay.textContent = cityTime;
            } else{
                hourOffset = Math.floor(hourOffset);
                cityTime = date.getUTCHours()+hourOffset+":"+
                                        (date.getUTCMinutes()+30);
                timeDisplay.textContent = cityTime;
        
            }
        }
    }
    else {
        if(cityMinutes > 30){
            hourOffset = Math.ceil(hourOffset);
            cityTime = date.getUTCHours()+hourOffset+":"+
                                (date.getUTCMinutes()-15);
            timeDisplay.textContent = cityTime;
        }
        else {
        hourOffset = Math.floor(hourOffset);
        cityTime = date.getUTCHours()+hourOffset+":"+
                                (date.getUTCMinutes()+15);
        timeDisplay.textContent = cityTime;
        }
    }
    
    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");
    timeDisplay.classList.add("timeDisplay");
    
    card.appendChild(cityDisplay);
    card.appendChild(weatherEmoji);
    card.appendChild(tempDisplay);
    card.appendChild(descDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(timeDisplay);
    
}

function getWeatherEmoji(weatherId){
    
    switch(true){
        case(weatherId >=200 && weatherId <300):
        document.getElementById("body").style.backgroundImage= "url(thunderstorm.jpg)";
        return "⛈";
        case(weatherId >=300 && weatherId <400):
        document.getElementById("body").style.backgroundImage= "url(rain.jpg)";
        return "🌦";
        case(weatherId >=500 && weatherId <600):
        document.getElementById("body").style.backgroundImage= "url(rain.jpg)";
        return "🌧";
        case(weatherId >=600 && weatherId <622):
        document.getElementById("body").style.backgroundImage= "url(snow.jpg)";
        return "❄";
        case(weatherId >=700 && weatherId <800):
        document.getElementById("body").style.backgroundImage= "url(mist.jpg)";
        return "🌫";
        case(weatherId === 800):
        document.getElementById("body").style.backgroundImage= "url(sun.jpg)";
        return "☀";
        case(weatherId >=800):
        document.getElementById("body").style.backgroundImage= "url(clear.jpg)";
        return "⛅";
    }
}

function displayError(message){
    
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}