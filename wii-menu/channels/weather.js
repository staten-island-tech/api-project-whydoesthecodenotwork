const position = navigator.geolocation.getCurrentPosition(
    getWeather,
    showError
);

async function getWeather(pos) {
    console.log(pos);
    try {
        const response = await fetch(
            `https://api.weather.gov/points/${pos.coords.latitude},${pos.coords.longitude}`
        );
        const data = await response.json();
        const forecast = await fetch(data.properties.forecast);
        const forecastData = await forecast.json();
        const periods = Object.values(forecastData.properties.periods);
        periods.forEach((period) =>
            document.querySelector("body").insertAdjacentHTML(
                "beforeend",
                `
                    <h2>on ${period.name} it will be ${period.temperature} degrees farenheight</h2>
                `
            )
        );
    } catch (error) {
        document
            .querySelector("body")
            .insertAdjacentHTML(
                "beforeend",
                `oh man, the government has exploded with the error ${error}`
            );
    }
}

function showError() {
    document
        .querySelector("body")
        .insertAdjacentHTML(
            "beforeend",
            "geolocation is not avaliab le..... skull emoji"
        );
}
