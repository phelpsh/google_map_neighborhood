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
& memorials of historical worth. 


// example AJAX call to get external data
$.getJSON(nytimesURL, function(data){
	$nytHeaderElem.text()	
	etc.etc.
	//graceful handling
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


//global variables to manage map and markers
var map;
var markers = []; //not used
var json = $.getJSON("/js/dc_landmarks.json");
var infowin; // to make sure closed - not used?
var curMarker; // to delete highlight
var bounds;

//initial start for map
function initMap() {
	//create style array
	var styles = getStyleArray();
	// Create a map object and specify the DOM element for display.
	map = new google.maps.Map(document.getElementById('map'), {
		styles: styles
	}); //global
	map.setCenter({lat: 38.891248, lng: -77.036551});
	map.setZoom(11);
	infowin = new google.maps.InfoWindow(); //global
	bounds = new google.maps.LatLngBounds(); //global
	ko.applyBindings(new LandmarkViewModel()); 
}


// Class to represent a list and marker
function landmarkItem(name, address, lat, lng) {
    var self = this;
    self.name = ko.observable(name); 
    //self.address = ko.observable(address);
    self.isVisible = ko.observable(true);  // used for visible binding
    // parts for Google Maps (not ko.observables)
    self.title = name;
    self.location = {lng: lng, lat: lat};

	//--------------markers-------------------------------

    var defaultIcon =  makeMarkerIcon("E60000");
    var highlightedIcon = makeMarkerIcon("FFB3B3");

 	function makeMarkerIcon(markerColor) {
		var markerImage = new google.maps.MarkerImage(
		'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
		'|40|_|%E2%80%A2',
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34),
		new google.maps.Size(21,34));
		return markerImage;
	}; 

	var marker = new google.maps.Marker({
		map: map,
		position: {lng: lng, lat: lat},
		title: name,
		animation: google.maps.Animation.DROP,
		icon: defaultIcon,
		highlight: highlightedIcon,
		baseicon: defaultIcon
	})

	marker.addListener('click', function() {
		if (curMarker) {
			curMarker.setIcon(curMarker.baseicon);
		} //resets icon to red 
		if (infowin.marker != marker) {
    		infowin.marker = marker;
    		infowin.setContent('<div>' + marker.title + '</div>');
    		infowin.open(map, marker);
    	} 
	});

	marker.addListener('mouseover', function() {
		marker.setIcon(marker.highlight);
	});

	marker.addListener('mouseout', function() {
		marker.setIcon(marker.baseicon);
	}); 

	self.marker = marker;
    
	bounds.extend(marker.position);
    
 	map.fitBounds(bounds); 

	//--------------end markers-------------------------------

	// TODO
    // call to external third API happens here
    // for each landmark item, call to external API and response
    // stored here. (this will be a function)


    return self;

}


var LandmarkViewModel = function() {
	
	var self = this;
    self.items = ko.observableArray(); 
	
	//populate everything for the list of landmarks
	//using the global json object created in initMap()
    for (var i = 0; i < 20; i++) {
		name = json.responseJSON.features[i].properties.Name;
        address = json.responseJSON.features[i].properties.ADDRESS;
        lat = json.responseJSON.features[i].geometry.coordinates[0][1];
        lng = json.responseJSON.features[i].geometry.coordinates[0][0];
        // list of items for list
        self.item = ko.observable(new landmarkItem(name, address, lat, lng));
        self.items.push(self.item);
        //console.log(self.items.length); //always saying 0
    }

    self.searchItem = ko.observable();

	self.doFilter = ko.computed(function() {
        var filter = self.searchItem();  // Read the current value
        var lmkItems = self.items();
        var lcFilter;
        var lcName;
        
        //initial list on load
        if (filter === undefined) {
        	return lmkItems;
        }

        //if chars are deleted, make everything show again
        if (filter === "") {
        	for (var i = 0; i < lmkItems.length; i++) {
        		lmkItems[i]().isVisible(true);
        		lmkItems[i]().marker.setVisible(true);
        	}
        	return lmkItems;
        }

        if (filter != "") {
        	//for (var i = 0; i < lmkItems.length; i++) {
    		for (var i = 0; i < lmkItems.length; i++) {
        		lcName = lmkItems[i]().name().toLowerCase();
	        	lcFilter = filter.toLowerCase();
	        	n = lcName.includes(lcFilter);
	        	if (n) {
	        		// make the list item visible
	        		lmkItems[i]().isVisible(true);
	        		lmkItems[i]().marker.setVisible(true);
	        	} else {
	        		// make the list item invisible
	        		lmkItems[i]().isVisible(false);
	        		lmkItems[i]().marker.setVisible(false);
	        	}
        	}
        	return lmkItems;
        }

    }); //end of doFilter function

    //(some of bounceUp taken from forum)
	bounceUp = function(place) {
		//clear the last selected marker if it exists
		if (curMarker) {
			curMarker.setIcon(curMarker.baseicon);
		}
		//open infowindow on marker
    	google.maps.event.trigger(place.marker, 'click');
    	// get it to bounce (don't like this, but it works)
    	//place.marker.setAnimation(google.maps.Animation.BOUNCE);
	    //setTimeout(function(){ place.marker.setAnimation(null); }, 750);
	    //change marker to highlighted color
	    place.marker.setIcon(place.marker.highlight);
	    curMarker = place.marker;
 	}

};  // end of LandmarkViewModel

