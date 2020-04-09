//declaring some variables
var searchSection = $("form");
var searchBox = $("#search")
var cityList = $("#search-hist");

//getting current day
const currentDate = moment();
console.log("Today's date is: " + currentDate.format('MM/DD/YYYY'));

//function to convert date
function dateConvert(epoch){
    var date = moment().format('MM/DD/YYYY');
}

//Function to add searched city names to the past cities section
function addCityList(cityValue){
    var currLocation = $("<div>");
    currLocation.addClass("btn waves-effect pastcity");
    currLocation.attr("data-name", cityValue)
    currLocation.text(cityValue.trim().toUpperCase())
    cityList.append(currLocation);
} 

//Function to create div to put information for hourly forecast


//Function to get the weather condition for the day and forecast for 5 days
function weatherForecast(city){
    //This api call is to get the current weather condition for a city
    var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=dbc47b8d78e589660c7834e13c830d1b";
    $.ajax({
        url: currentWeatherURL,
        method: "GET"
    }).then(function(currWeathresponse){
        console.log(currWeathresponse);
        $("#weatherIcon").attr("src", "http://openweathermap.org/img/wn/" + currWeathresponse.weather[0].icon + "@2x.png");
        $("#cityName").text(currWeathresponse.name).append(" (" + currentDate.format('MM/DD/YYYY') + ")");
        $("#curTemp").text("Temperature: " + currWeathresponse.main.temp + " °F");
        $("#curHum").text("Humidity: " + currWeathresponse.main.humidity + " %");
        $("#curWind").text("Wind Speed: " + currWeathresponse.wind.speed + " MPH");

        var longitude = currWeathresponse.coord.lon;
        console.log(longitude)
        var latitude = currWeathresponse.coord.lat;
        console.log(latitude)

        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=dbc47b8d78e589660c7834e13c830d1b&lat=" + latitude + "&lon=" + longitude;
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function(uvresponse){
            console.log(uvresponse)
            var uvValue = parseFloat(uvresponse.value);
            let color = '';
            if(uvValue < 3){
                color = 'green';
            }else if(uvValue < 6){
                color='yellow';
            }else if(uvValue < 8){
                color='orange'
            }else if(uvValue < 11){
                color='red'
            }else{
                color='violet'
            }

            var uvColor = "UV Index: " + `<span style="background-color:${color}; padding: 0 7px 0 7px;">${uvresponse.value}</span>`;
            console.log(uvColor);

            $("#curUv").html(uvColor);
        })
    })

    var hourlyURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=dbc47b8d78e589660c7834e13c830d1b";
    $.ajax({
        url: hourlyURL,
        method: "GET"
    }).then(function(hourlyWeathresponse){
        console.log(hourlyWeathresponse);

    })

}

//Adding eventlistener to get the city name text
$("#getWeather").click(function(e){
    e.preventDefault();
    weatherForecast(searchBox.val().trim());
    addCityList(searchBox.val().trim());
    searchBox.val('');  //This will clear out the searchbox after submiting a city name
    
});
