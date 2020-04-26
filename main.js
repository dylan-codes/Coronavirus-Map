//This WebApp uses an NPM package called 'http-server'. It allows me to host a local server through the CMD.
//Since the app needs to run on a server to import and use online data it is very neccessary!
//Uses Mapbox API, Fetch API, the http-server request NPM Package,  and information compiled from the Novel Covid API (https://corona.lmao.ninja/)
//------------------------------------------------------------------------------------------------------------------------------------------------


//Initializes MapBox API
import 'https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.js';

//Add your personal token here!
const mapboxToken = "";
mapboxgl.accessToken = mapboxToken;


//Creates the MapBox variable, uses one of the API's styles, and sets zoom level.
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 1.5
  });


//Sets the color of the markers depending on the case number (intensity).
//GREEN = Less than 50 | YELLOW = Between 50-500 | ORANGE = Between 500-50,000 | RED = Between 50,000-100,000
const caseIntensity = count => {
  if (count >= 100000){
    return "#f22613"
  }
  if (count >= 50000){
    return "#f15a22"
  }
  if (count >= 500){
    return "#f39c12"
  }
  if (count >= 50){
    return "#f5e51b"
  }
  return "#87d37c";
}


//Utilizes Fetch API to grab information from an online JSON file that includes constantly updating COVID-19 information.
//Converts response to .json, and creates a variable with imported data.
fetch("https://corona.lmao.ninja/v2/countries")
  .then(response => response.json())
  .then(data => {
    const places = data;

    //Uses the Array.forEach operation to loop through the array.
    //All the included functions are executed 1 time on each array element.
    places.forEach(report => {
      //Unpacks the specific data we will use from the array included in the JSON file.
      const { cases, country, countryInfo, active, recovered, deaths } = report;

        // Creates a popup event when the country is clicked. (Displays Country, cases, active cases, recovered cases, and deaths.)
        var popup = new mapboxgl.Popup({offset: 45})
            .setHTML('<h3>' + country + '</h3><p> Cases: ' + cases + '</p>' + '<p> Active: ' + active + '</p>' +
              '<p> Deaths: ' + deaths + '</p>' + '<p> Recovered: ' + recovered + '</p>');

        // Creates a div element for the Marker Title (Sets the name of the country above the marker)
        var el = document.createElement('div');
          el.innerHTML = country;
          el.id = 'marker';

        //Function to create the marker for the given Array element. (Sets Location and uses caseIntensity function to set color)
        new mapboxgl.Marker({
          color: caseIntensity(cases)
        })
        .setLngLat([countryInfo.long, countryInfo.lat])
        .setPopup(popup) // Sets a popup for information to show whenever the marker is clicked.
        .addTo(map);

        //Sets the country name above the marker
        new mapboxgl.Marker(el, {offset:[0, -40]})
            .setLngLat([countryInfo.long, countryInfo.lat])
            .setPopup(popup) // Sets popup so that if only the country name is clicked info will still show.
            .addTo(map);

      });

  });
