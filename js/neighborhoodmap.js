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

//AIzaSyBXcgHyvjUBGyfoyiNqTTw94-CgbAFypRg - google maps API key */

//global variables to manage map and markers
var map;
var markers = []; //not used
var json; //= $.getJSON("/js/dc_landmarks.json");
var infowin; // to make sure closed - not used?
var curMarker; // to delete highlight
var bounds;

function mapError() {
	alert("Google Maps is not currently available");
}

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
		baseicon: defaultIcon,
		address: address
	});

	var nameNS = name.replace(/ /g, "_"); //get rid of all the spaces for API call
	//console.log(nameNS);
	
    $.ajax({
        type: "GET",
        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + nameNS + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
 
 			//console.log(data.parse===undefined);
 			if (data.parse === undefined) {
	 			marker.desc = "No Wikipedia data for this location.";
 			} else {
 				var markup = data.parse.text["*"];
	            var blurb = $('<div></div>').html(markup);
	 			// code borrowed from 
	 			// http://www.9bitstudios.com/2014/03/getting-data-from-the-wikipedia-api-using-jquery/
	            // remove links as they will not work
	            blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
	            // remove any references
	            blurb.find('sup').remove();
	            // remove cite error
	            blurb.find('.mw-ext-cite-error').remove();
	            // $('#article').html($(blurb).find('p'));
	            var it = $(blurb.find('p')[0]);
	            if (it[0].innerText === "Redirect to:") {
	            	marker.desc = "No Wikipedia data for this location."
	            } else {
	            	marker.desc = it[0].innerText;
	            }
	            
 			} // end if statement
        }, //end success function
        error: function (errorMessage) {
        	marker.desc = "No Wikipedia data available at this time."
        } // end error function
    }); // end ajax call

	marker.addListener('click', function() {
		if (curMarker) {
			curMarker.setIcon(curMarker.baseicon);
		} //resets icon to red 
		if (infowin.marker != marker) {
    		infowin.marker = marker;
    		var winTitle = '<div class="window-head">' + marker.title + '</div>';
    		var winAddress = '<div>' + marker.address + '</div>';
    		var winDesc = '<div class="underlined">Data from Wikipedia:</div><div>' + marker.desc + '</div>';
    		var winContent = winTitle + winAddress + winDesc;
    		infowin.setContent(winContent);

    		// infowin.setContent('<div>' + marker.title + '</div><div>' + 
    		// marker.address + '</div><div>' + marker.desc + '</div>');
    		marker.setIcon(marker.highlight);
			curMarker = marker;

    		infowin.open(map, marker);
    	} // end if 
	}); // end function

	// marker.addListener('mouseover', function() {
	// 	marker.setIcon(marker.highlight);
	// });

	// marker.addListener('mouseout', function() {
	// 	marker.setIcon(marker.baseicon);
	// }); 

	self.marker = marker;
    
	bounds.extend(marker.position);
    
 	map.fitBounds(bounds); 

    return self;

} // end function landmark item


var LandmarkViewModel = function() {
	
	var self = this;
    self.items = ko.observableArray(); 

 //    $.getJSON("/js/dc_landmarks.json", function(json) {
 //    	for (var i = 0; i < 20; i++) {
			
	// 		name = json.features[i].properties.Name;
	//         address = json.features[i].properties.ADDRESS;
	//         lat = json.features[i].geometry.coordinates[0][1];
	//         lng = json.features[i].geometry.coordinates[0][0];
	//         //list of items for list
	//         self.item = ko.observable(new landmarkItem(name, address, lat, lng));
	//         self.items.push(self.item);
	//     } // end for
	// });

	   $.getJSON("/js/dc_landmarks.json")
	   		.done(function(json) {
		    	for (var i = 0; i < 20; i++) {
					
					name = json.features[i].properties.Name;
			        address = json.features[i].properties.ADDRESS;
			        lat = json.features[i].geometry.coordinates[0][1];
			        lng = json.features[i].geometry.coordinates[0][0];
			        //list of items for list
			        self.item = ko.observable(new landmarkItem(name, address, lat, lng));
			        self.items.push(self.item);
			    } // end for
			})
			.fail(function() { 
			    console.log("no items"); // works
			    // needs to stop drawing because there's no data.
			    // display an error webpage with a blank google map 
			    //self.item = ko.observable(new landmarkItem());
		        //self.items.push(self.item);
		        //write to div id=list????? HOOOCH - "No data found."
		        $( "#list" ).append( "<ul><li>Error requesting file, no items to display</li></ul>");
			});


    self.searchItem = ko.observable();

	self.doFilter = ko.computed(function() {
        var filter = self.searchItem();  // Read the current value
        var lmkItems = self.items();
        var lcFilter;
        var lcName;
        
        //initial list on load
        if (filter === undefined) {
        	return lmkItems;
        } // end of it initiation filter

        //if chars are deleted, make everything show again
        if (filter === "") {
        	for (var i = 0; i < lmkItems.length; i++) {
        		lmkItems[i]().isVisible(true);
        		lmkItems[i]().marker.setVisible(true);
        	}
        	return lmkItems;
        } // end of if for blank filter

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
        } // end of if filter != ""

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
    	// place.marker.setAnimation(google.maps.Animation.BOUNCE);
	    // setTimeout(function(){ place.marker.setAnimation(null); }, 750);
	    //change marker to highlighted color
	    place.marker.setIcon(place.marker.highlight);
	    curMarker = place.marker;
 	}

} // end of LandmarkViewModel

