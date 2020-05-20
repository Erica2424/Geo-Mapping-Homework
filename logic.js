//to get the magnitude and place value from json within javascript I would use:

var apikey = "pk.eyJ1IjoiZXJpY2FtYXRyZXNlIiwiYSI6ImNrOHJ4anM2MTAwZWwzZHFmMnYwaWV6N2MifQ.tF241AeWPDNtEX_vurr0kQ"


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson").then((json_data)=>{

	var events=[]
	//the property 'fearues' is an array, with each element correseponding to an earthquake event
	//to get the magnitude and place of the earthquake we must iterate through each event in the array
	//so that we can extract the 'mag' and 'place' values from within the 'properties' dictionary object
	var features=json_data.features;
	features.forEach(function (earthquake){
		var properties=earthquake.properties;
		var magnitude=properties.mag;
		var place = properties.place;

		var geometry = earthquake.geometry;
		var coordinates = geometry.coordinates;
		var lat = coordinates[0];
		var long = coordinates[1];

		//now we have isolated every value we want related to the earthquake event, lets store it so we can use it later
		var e={
			mag:magnitude,
			place:place,
			y:lat,
			x:long
		}
		events.push(e); 		//this event can later be accessed from within the "events" variable
	})
	//we need to create the mapcanvas now that we hav all of our required information
	//https://leafletjs.com/reference-1.6.0.html#map-factory
	var map = L.map('mymap',{
		center: [30.00, -100.00],
		zoom: 2,
		zoomControl: true
	})
	//The map canvas will be a balnk, grey square if we do not define a Layer to tile the grey box with
	//Basically this is the background image for the map
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', 
	{
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,	
		id: 'mapbox/satellite-v9',	//satellie looks nice
		tileSize: 512,
		zoomOffset: -1,
		accessToken: apikey
	}).addTo(map);
	//Now that our grey box has a background image of satellite-view earth, lets add our markers
	events.forEach((event)=>{
		//do something with the event information, such as create a marker and add it to the map..
		//These coordinates are reveresed
		var pop = L.popup({	//lets make a nice looking popup
			minWidth: 100,
			autoPan: true,
			closeButton: true,
			autoClose: true,
			closeOnClick: true
		}).setLatLng([event.x,event.y]).setContent("<p>"+event.place+"\n("+event.x+","+event.y+")</p>");
		var mark = L.marker([event.x,event.y],{
			title:event.place+"\n("+event.x+","+event.y+")",
			riseOnHover: true,
			alt: event.place
		}).addTo(map);
		mark.bindTooltip(mark.title).openTooltip()
		//mark.bindPopup("I input what is displayed in the popup here").openPopup();
		mark.bindPopup(pop).openPopup();
	})
})