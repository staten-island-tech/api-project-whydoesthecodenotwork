const weather_codes = {
    0: ["Clear sky"],
    1: ["Mainly clear"],
    2: ["Partly cloudy"],
    3: ["Overcast"],
    45: ["Fog"],
    48: ["Depositing rime fog"],
    51: ["Light drizzle"],
    53: ["Moderate drizzle"],
    55: ["Dense drizzle"],
    56: ["Light freezing drizzle"],
    57: ["Dense freezing drizzle"],
    61: ["Slight rain"],
    63: ["Moderate rain"],
    65: ["Heavy rain"],
    66: ["Light freezing rain"],
    67: ["Heavy freezing rain"],
    71: ["Slight snow"],
    73: ["Moderate snow"],
    75: ["Heavy snow"],
    77: ["Snow grains"],
    80: ["Slight rain showers"],
    81: ["Moderate rain showers"],
    82: ["Heavy rain showers"],
    85: ["Slight snow showers"],
    86: ["Heavy snow showers"],
    95: ["Thunderstorm"],
    96: ["Thunderstorm with slight hail"],
    99: ["Thunderstorm with heavy hail"],
};

const position = navigator.geolocation.getCurrentPosition(getWeather, showError);

async function getWeather(pos) {
    console.log(pos);
    try {
        const today = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&hourly=temperature_2m,precipitation_probability,weather_code&temperature_unit=fahrenheit&timezone=auto&forecast_days=1`
        ).then((response) => response.json());
        console.log(today);
        for (let i = 0; i < 24; i++) {
            document.querySelector("body").insertAdjacentHTML(
                "beforeend",
                `
                <h2>${weather_codes[today.hourly.weather_code[i]]}</h2>
                <p>
                    at ${new Date(today.hourly.time[i]).getHours()}:00 
                    it will be ${today.hourly.temperature_2m[i]} degrees farenheight 
                    with a precipitation chance of ${today.hourly.precipitation_probability[i]}%
                </p>
                `
            );
        }
    } catch (error) {
        document.querySelector("body").insertAdjacentHTML("beforeend", `my goodnedss... there is the error of ${error}`);
    }
}

function showError() {
    document.querySelector("body").insertAdjacentHTML("beforeend", "geolocation is not avaliab le..... skull emoji");
}
