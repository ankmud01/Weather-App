$(document).ready(function () {
    //declaring variables
    var searchSection = $("form");
    var searchBox = $("#search")
    var cityList = $("#search-hist");

    //getting current day using moment js
    const currentDate = moment();
    console.log("Today's date is: " + currentDate.format('MM/DD/YYYY'));

    //Function to convert epoch time from response to redable date using Date().get..()
    function dateConvert(epoch) {
        if (epoch < 10000000000)
            epoch *= 1000;  // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)
        var epoch = epoch + (new Date().getDate());
        return moment(epoch).format('MM/DD/YYYY');

    }

    //Function to add searched city names to the past search section
    function addCityList(cityValue) {
        var currLocation = $("<div>");                          //creating a div
        currLocation.addClass("btn waves-effect pastcity");     //adding class to the new div
        currLocation.attr("data-name", cityValue)               //adding attribute
        currLocation.text(cityValue.trim().toUpperCase())       //adding cityValue to div and changing it to uppercase
        cityList.append(currLocation);                          //appending the div to past search section
    }

    //Function to create div to put information for hourly forecast section
    function hourlyForecast(list) {
        for (var i = 0; i < list.length; i++) {
            //Creating div element and a header tag to place the lines which has the list of values
            var dailydiv = $("<div>").attr("class", "col s2");
            var dailycard = $("<div>").attr("class", "card dailyforecast");
            var dailycontent = $("<h6>").attr("class", "content");
            dailycontent.text(list[i].date)

            //Creating lines dynamically to place the values from the list which is input to this function
            var dailyul = $("<ul>");
            var iconli = $("<li>")
            var iconimage = $("<img>");
            iconimage.attr("src", list[i].icon);
            var weatherli = $("<li>");
            weatherli.text(list[i].weather);
            var templi = $("<li>");
            templi.text("Temperature: " + list[i].temperature + " °F");
            var humidli = $("<li>");
            humidli.text("Humidity: " + list[i].humidity + "%");

            //Appending the created li elements to the ul(dailyul) elements     
            iconli.append(iconimage);
            dailyul.append(iconli);
            dailyul.append(weatherli);
            dailyul.append(templi);
            dailyul.append(humidli);

            //Appending the ul from above to the parent div and it's associated parent div
            dailycontent.append(dailyul);
            dailycard.append(dailycontent);
            dailydiv.append(dailycard);

            //Appending all the dynamically created div to the static div on the html page
            $("#forecast").append(dailydiv);
        }

    }


    //Function to get all the weather condition for the day and forecast for 5 days
    function weatherForecast(city) {
        //This api call is to get the current weather condition for a city for current day
        var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=dbc47b8d78e589660c7834e13c830d1b";
        $.ajax({
            url: currentWeatherURL,
            method: "GET"
        }).then(function (currWeathresponse) {
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
            //This api call utilizes the longitude and latitude from above call and finds the uv index. The for loop is for the color based on uv index value
            var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=dbc47b8d78e589660c7834e13c830d1b&lat=" + latitude + "&lon=" + longitude;
            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function (uvresponse) {
                console.log(uvresponse)
                var uvValue = parseFloat(uvresponse.value);
                let color = '';
                if (uvValue < 3) {
                    color = 'green';
                } else if (uvValue < 6) {
                    color = 'yellow';
                } else if (uvValue < 8) {
                    color = 'orange'
                } else if (uvValue < 11) {
                    color = 'red'
                } else {
                    color = 'violet'
                }

                //adding a span element to the variable which holds uv value so that i can color the value
                var uvColor = "UV Index: " + `<span style="background-color:${color}; padding: 0 7px 0 7px;">${uvresponse.value}</span>`;
                console.log(uvColor);

                $("#curUv").html(uvColor);
            })
        })

        //This api call is to get the 5 day forecast for the city
        var weatherlistArr = [];
        var weatherlistObj = {};
        var hourlyURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=dbc47b8d78e589660c7834e13c830d1b";
        $.ajax({
            url: hourlyURL,
            method: "GET"
        }).then(function (hourlyWeathresponse) {
            console.log(hourlyWeathresponse);
            for (var i = 3; i < hourlyWeathresponse.list.length; i += 8) {
                var weatherlist = hourlyWeathresponse.list[i];
                console.log(weatherlist);
                weatherlistObj = {
                    date: dateConvert(weatherlist.dt),
                    weather: weatherlist.weather[0].description,
                    icon: "http://openweathermap.org/img/w/" + weatherlist.weather[0].icon + ".png",
                    temperature: weatherlist.main.temp,
                    humidity: weatherlist.main.humidity
                };
                console.log(weatherlistObj);
                weatherlistArr.push(weatherlistObj);
            }

            hourlyForecast(weatherlistArr);

        })

    }

    //Adding eventlistener to get the city name text and load all the weather for the city
    $("#getWeather").click(function (event) {
        event.preventDefault();
        weatherForecast(searchBox.val().trim());
        addCityList(searchBox.val().trim());
        setSearchHist(searchBox.val().trim().toUpperCase());
        $("#forecast").text('');    //This will stop appending next city's 5 day forecast to current city

    });

    //Adding eventlistener to get the weather for the city when one of the past searched city is clicked
    $("#search-hist").click(function (event) {
        event.preventDefault();
        var pastCityName = $(event.target)[0]
        if (pastCityName.className === "btn waves-effect pastcity") {
            console.log(pastCityName.innerText);
            weatherForecast(pastCityName.innerText.trim().toLowerCase());
            $("#forecast").text('');
        }
    })

    //Function to add search History to local storage
    function setSearchHist(city) {
        var searchedCity = JSON.parse(localStorage.getItem('cityValue')) || []; //Declare an array variable to set city in localstorage
        searchedCity.push(city)
        //using filter method to remove duplicate from the list of searchedCity
        var refinedsearchCity = searchedCity.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
        });

        localStorage.setItem('cityValue', JSON.stringify(refinedsearchCity))
        searchBox.val('');          //This will clear out the searchbox after settng the city name to local storage

    };

    //Function to get search History from local storage
    function getSearchHist() {
        var searchedCity = JSON.parse(localStorage.getItem('cityValue')) || [];
        searchedCity.forEach(addCityList);
    }

    //This should load the search history from local storage if available when app is loaded
    getSearchHist();
});