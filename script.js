//declaring some variables
var searchSection = $("form");
var searchBox = $("#search")
var cityList = $("ul");

//getting current day
const currentDate = moment();
console.log("Today's date is: " + currentDate.format('MM/DD/YYYY'));

//Function to add searched city names to the ul
function addCityList(text){
   const singleCity = document.createElement('li');
    singleCity.textContent = text;
    $("ul").append(singleCity);
} 

//Adding eventlistener to get the city name text
$("form").submit(function(e){
    e.preventDefault();
    addCityList(searchBox.val());
    searchBox.val('');  //This will clear out the searchbox after submiting a city name
});