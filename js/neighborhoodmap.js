//http://opendata.dc.gov/datasets/a84610f08a2943d588d71ff059a5788b_22
// DC Landmarks data from OpenData.dc.gov. Downloaded as KML and converted
// to GeoJSON with ogre then reformatted nicely with JSONLint
/*
This dataset contains Historic Landmarks (by structure) officially 
designated by the District of Columbia. This is a consolidated 
collection of structures with historical significance within the 
District of Columbia as listed in the "District of Columbia 
Inventory of Historic Sights". It contains the point locations 
and attributes of buildings, statues, bridges, forts, fountains, 
& memorials of historical worth. Additional datasets are 
available of Historic Districts. 


$.getJSON(nytimesURL, function(data){
	$nytHeaderElem.text()	
	etc.etc.

}).error(function(e){
	$nytHeaderElem.text("New York Times can't be loaded");

});

var ViewModel = function() {
//list (observableArray)
//map
//create markers for map Creating your markers as a 
//part of your ViewModel is allowed (and recommended).

//filter option text input field (to filter list and map markers)

}

//AIzaSyBXcgHyvjUBGyfoyiNqTTw94-CgbAFypRg - google maps API key

var mapList = () //video 30

// ko.applyBindings(new ViewModel()); */
// var octupus = {

// 	init: function() {
// 		//load the map VIEW
// 		//read the JSON and create a bunch of landmarks objects MODEL
// 		//load all the markers to map VIEW
// 		//load the list using landmark objs VIEW
// 	}

// 	// setCurrentItem: function (item){
// 	// 	model.currentItem = item;
// 	// },

// 	// getCurrentItem: function(){
// 	// 	return model.currentItem;
// 	// }

// 	// showSearchResults: function(results) {
// 	// 	//update the map markers to reflect list change
// 	// 	//(list change happens with ko)
// 	// }

// }

//initial start for map
function initMap() {
//create style array
	console.log("callback initiating"); //works!
	var styles = getStyleArray()

	// Create a map object and specify the DOM element for display.
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 38.891248, lng: -77.036551},
		zoom: 11, 
		styles: styles
	});

}

function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage(
	'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
	'|40|_|%E2%80%A2',
	new google.maps.Size(21, 34),
	new google.maps.Point(0, 0),
	new google.maps.Point(10, 34),
	new google.maps.Size(21,34));
	return markerImage;
}


function refreshMap(positions) {
	// console.log(positions[0].title); // works!
	var locations = positions
	var bounds = new google.maps.LatLngBounds();
	var largeInfoWindow = new google.maps.InfoWindow();
    var defaultIcon = makeMarkerIcon("E60000");
	var highlightedIcon = makeMarkerIcon("FFB3B3");
	for  (var i=0; i < locations.length; i++) {
		var position = locations[i].location;
		var title = locations[i].title;
		//create a marker per location, and put into markers array
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			animation: google.maps.Animation.DROP,
			icon: defaultIcon,
			id: i
		})
		markers.push(marker);
		bounds.extend(marker.position);
		//onclick event for each
		marker.addListener('click', function(){
			populateInfoWindow(this, largeInfoWindow);
		});
		// Two event listeners - one for mouseover, one for mouseout,
		// to change the colors back and forth.
		marker.addListener('mouseover', function() {
			this.setIcon(highlightedIcon);
		});

		marker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});
	} // end for loop

	map.fitBounds(bounds);

} // end function

function populateInfoWindow(marker, infowindow) {
	//check to make sure not already open
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.setContent('<div>' + marker.title + '</div>');
		infowindow.open(map, marker);
	}
}

// Class to represent a list item 
function landmarkItem(name, address, lat, lng) {
    var self = this;
    self.name = name;
    self.address = address;
    self.lat = lat;
    self.lng = lng;
    return self;
}

function markerItem(name, lat, lng) {
    var self = this;
    self.title = name;
    self.location = {lng: lng, lat: lat};
    return self;
}

var json = $.getJSON("/js/dc_landmarks.json", function() {
	var items = [];
	var positions = []
	//populate everything for the list of landmarks
    for (var i = 0; i < 20; i++) {
		name = json.responseJSON.features[i].properties.Name;
        address = json.responseJSON.features[i].properties.ADDRESS;
        lat = json.responseJSON.features[i].geometry.coordinates[0][1];
        lng = json.responseJSON.features[i].geometry.coordinates[0][0];
        // list of items for list
        item = new landmarkItem(name, address, lat, lng);
        items.push(item);
        //set the initial map with all the features as markers
        position = new markerItem(name, lat, lng);
        positions.push(position);  
    }
    //set the initial map with all the features as markers
    refreshMap(positions); 

    //create new LandmarkViewModel with the list
    ko.applyBindings(new LandmarkViewModel(items));
}); //end json and initialize section

var LandmarkViewModel = function(items) {
	self = this;
    self.items = ko.observableArray(items);
    self.searchItem = ko.observable();
    self.doFilter = function() {
        var filter = self.searchItem();        // Read the current value
        if(!filter) {
        	alert("Please enter a search term.");
        } else {
        	filteredItems = [];
        	var n = false;
        	for (var i = 0; i < items.length; i++) {
		    	n = items[i].name.includes(filter);
		    	//TODO: make case-independent (now "Am" returns American but not "am")
		    	if (n) {
		    		filteredItems.push(items[i]);
		    	}  // end if
		    }  // end for loop
		    if (!filteredItems.length == 0) {
        		self.items(filteredItems); //set the new data in items bind
        		// make new marker set with filteredItems
        		var locations = [];
        		for (var i = 0; i < filteredItems.length; i++) {
        			var mkr = self.makeMarker(filteredItems[i].name, 
        				  					  filteredItems[i].lat, 
        				  			          filteredItems[i].lng);
        			locations.push(mkr);
        		}
        		// refresh the map to show new markers
        		refreshMap(locations)
		    } else {
		    	alert("That search term did not return any results.");
		    }


        }  // end else 
    };  // end of doFilter function

    self.makeMarker = function(name, lat, lng) {
    	var mkr = {title: name, location: {lng: lng, lat: lat}};
    	return mkr;
    }  //end makeMarker function

};  // end of model
