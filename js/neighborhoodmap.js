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

// Class to represent a list item 
function landmarkItem(name, address, lat, lng) {
    var self = this;
    self.name = name;
    self.address = address;
    self.lat = lat;
    self.lng = lng;
    return self;
}

var json = $.getJSON("/js/dc_landmarks.json", function() {
	var items = [];
	//populate everything for the list of landmarks
    for (var i = 0; i < 20; i++) {
		name = json.responseJSON.features[i].properties.Name;
        address = json.responseJSON.features[i].properties.ADDRESS;
        lat = json.responseJSON.features[i].geometry.coordinates[0][1];
        lng = json.responseJSON.features[i].geometry.coordinates[0][0];
        item = new landmarkItem(name, address, lat, lng);
        items.push(item);
    }
    //create new LandmarkViewModel with the list
    ko.applyBindings(new LandmarkViewModel(items));
});

var LandmarkViewModel = function(items) {
	self = this;
    self.items = ko.observableArray(items);
    self.searchItem = ko.observable();
    //self.currentFilter = ko.observable(); //to store the filter
	//self.currentFilter(self.searchItem); 
    
    //populate markers TODO
    for (var i = 0; i < 2; i++) {
    	alert(items[i].lat); //returns object object
    	//TODO: take into account filter
    }

    self.doFilter = function() {
        var filter = self.searchItem();        // Read the current value
        if(!filter) {
        	alert("filter is empty");
        } else {
			//filter the items
        	alert("filter is full")
        }
    };

};


//data-bind="click: doFilter"
//data-bind="value: searchItem"


    // self.searchLandmarks = ko.computed(function() {
    //     if (!self.currentFilter()) {
    //         return self.items();
    //     } else {
    //         return ko.utils.arrayFilter(self.items(), function (item) {
    //             return item.name == self.currentFilter();
    //         });
    //     }
    // });
    // 	var filter = this.searchItem;//.toLowerCase();
    //     if (filter) {
    //     	return ko.utils.arrayFilter(this.items, function(item) {
    //         	return ko.utils.stringStartsWith(item.name().toLowerCase(), filter);
    //     	});
    //     } else {
    //      	return this.items;
    //     }
			// //go through list of items and only show those with searchItem present
			// ko.computed(function() {
			// 	return this.fil
			// 	})
			// }
   //      }
            
            //this.searchItem(""); // Clears the text box
            //iterate through items and filter? heather - here
        
    //}).bind(this);  // Ensure that "this" is always this view model










