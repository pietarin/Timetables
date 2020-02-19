## Timetables
Info screen, which displays HSL public transportation timetables between a location of your choice and Pohjoinen rautatienkatu 25.

# To run the app, visit https://whispering-dawn-76322.herokuapp.com/.

The app fetches the coordinates of whatever address you type into the searchbar after you hit "Hae aikatauluja".
The coordinates are fetched from the digitransit Geocoding API with an axios GET-request.

You are then provided with a list of 10 addresses from which you can pick whichever one best suits your needs.
When you click one of the addresses, the app renders the 3 fastest public transportation routes for your convenience.
The routes are fetched from digitransit Routing API via GraphQL queries.

The routes are initially displayed from the location you chose to Pohjoinen rautatienkatu 25, but you may press the toggle directly above the list of routes to change the direction of the routes.

# Happy commuting!