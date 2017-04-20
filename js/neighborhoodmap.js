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
var markers = [];
var json = $.getJSON("/js/dc_landmarks.json");
var infowin;

//initial start for map
function initMap() {
	//create style array
	var styles = getStyleArray()
	// Create a map object and specify the DOM element for display.
	map = new google.maps.Map(document.getElementById('map'), {
		styles: styles
	}); //global
	map.setCenter({lat: 38.891248, lng: -77.036551});
	map.setZoom(11);
	infowin = new google.maps.InfoWindow(); //global
	ko.applyBindings(new LandmarkViewModel()); 
}

var listView = {
	 init: function() {
        // store pointers to our DOM elements for easy access later
        this.listItem = document.getElementById("lmk").onclick = function() {
    		console.log("eureka!")
		}
	}
}



// function populateInfoWindow(marker, infowindow) {
// 	//check to make sure not already open
// 	if (infowindow.marker != marker) {
// 		infowindow.marker = marker;
// 		infowindow.setContent('<div>' + marker.title + '</div>');
// 		infowindow.open(map, marker);
// 	}
// }

// Class to represent a list and marker
function landmarkItem(name, address, lat, lng) {
    var self = this;
    // self.name = name;
    self.name = ko.observable(name); //per Nick
    // when name gets clicked, make the map marker jump

    //TODO
    // var p = self.name;
    // p.addListener('click', function() {
    // 	console.log("something is happening");   
    // 	//needs to call something in external function??     
    // });
    


    // self.address = address;
    self.address = ko.observable(address); //per Nick
    // parts for Google Maps (not ko.observables)
    
    listView.init(); //adds click event to anchor - doesn't work


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
    
    var bounds = new google.maps.LatLngBounds();
	bounds.extend(marker.position);
    
 	//map.fitBounds(bounds); //only goes to last marker TODO

	//--------------end markers-------------------------------



   
 
    // call to external third API happens here
    // for each landmark item, call to external API and response
    // stored here. (this will be a function)

    // what happens on an item click - 
    // animate click etc all happens in 
    // model


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
        //item = new landmarkItem(name, address, lat, lng);
        self.items.push(self.item);
        //console.log(self.items.length); //always saying 0
    }

    self.searchItem = ko.observable();

    self.doFilter = function() {
        var filter = self.searchItem();  // Read the current value
        if(!filter) {
        	alert("Please enter a search term.");
        } else {
        	var n = false;
        	//console.log(self.items().length); //works use ()
        	//gives total number but are all the same thing
        	// for (var i = 0; i < self.items().length; i++) {
        	// 	console.log(self.items()[i]);
        	// }
			var filteredItems = self.items().map(function(item) {
				//now changes all 20 to the same thing (the last one)
				
        		//console.log(self.items().item.name)
		    	n = self.item().title.includes(filter);
		    	console.log(n);

		    	// if (n) {
		    	// 	filteredItems.push(items[i]);
		    	// }  // end if
		    // } // end for loop
		    });
		 // 	var filteredItems = ([]);
			// self.items().forEach(function(item) {
			// 	n = self.item().title.includes(filter);
		 //    	console.log(n);
			// 	//console.log(self.item().title);
			// // });
			// for (var i = 0; i < self.items().length; i++) {
		 //        item = self.items()[i];
		 //        console.log("name is " + item.title);
		 //    }
		    //var filteredItems = ([]);
		    if (!filteredItems.length == 0) {
        		self.items(filteredItems); //set the new data in items bind
		    } else {
		    	alert("That search term did not return any results.");
		    }


        }  // end else 
    };  // end of doFilter function

    //(taken from forum:
    //https://discussions.udacity.com/t/triggering-marker-bounce-w-list-binding/41089/11)
	bounceUp = function(place) {
    	//console.log(place.marker);
    	google.maps.event.trigger(place.marker, 'click');
    	// get it to bounce - TODO  https://developers.google.com/maps/documentation/javascript/examples/marker-animations
    	
 	}

};  // end of LandmarkViewModel

