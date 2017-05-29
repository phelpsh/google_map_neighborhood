# Google Neighborhood Map Application

This one-page map application reads from a geoJSON file and uses the Google Maps JavaScript API to plot the points on a Google Map. The interactive list and search is done with knockout.js. This application was written using a view-model-viewmodel format for best practices. The application was created using a local install of the Google App Engine, which is required to run the application locally.

## Quickstart:

+ Copy the app.yaml and neighborhood.py to the local drive
+ Copy the css, js, and templates folders to the same directory as the app.yaml file
+ Launch the application by using dev_appserver.py app.yaml command from terminal inside of the application's (root) folder to start the web server
+ Navigate to the local web server browser (i.e. http://localhost:8080/) to view the application.

## What’s included:

/:<br>
   - app.yaml <br>
   - neighborhood.py <br>

/css: <br>
   - style.css <br>
   - bootstrap-theme.css (included for bootstrap)<br> 
   - bootstrap-theme.min.css (included for bootstrap)<br>
   - bootstrap.css (included for bootstrap)<br>
   - bootstrap.min.css (included for bootstrap)<br>
   
/templates: <br>
   - cats.html <br>
   
/js: <br>
   - dc_landmarks.json (data) <br>
   - knockout-3.4.2.js <br>
   - neighborhoodmap.js <br>
   - bootstrap.js <br>
   - bootstrap-min.js <br>
   - jquery-3.1.1.js <br>
   
