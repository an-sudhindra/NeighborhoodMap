# NeighborhoodMap
A single-page web application, built using the React framework, that displays a Google Map of an area and various points of interest. Users can search all included landmarks and, when selected, additional information about a landmark is presented using the data fetched from FourSquare APIs.

## Features
1. Enter a place name into the search box to filter the shown locations on the map.
2. Click on the filtered / listed location to view the details on the Map and aslo data is fetched from the Fourquare API.
3. Click on any marker to see the location details fetched from the [FourSquare APIs](https://developer.foursquare.com/).

## Installation
The project uses [Node.js](https://nodejs.org/en/) and the [Create-React-App starter code](https://github.com/facebookincubator/create-react-app).

1. Navigate to the directory where you want to store the application in terminal window.
2. Clone this repo `git clone https://github.com/an-sudhindra/NeighborhoodMap.git`
3. Install all modules and dependencies by running the command `npm install`
4. Start the application with command `npm start`
5. A browser window opens automatically displaying the application.  If it doesn't start, navigate to [http://localhost:3000/](http://localhost:3000/) in your browser

## NOTES:
*Service worker will only cache the site pages when it is build to run in production mode.*

## *Build and Run* the project in Production Mode
1. Open the command prompt, navigate to the project directory. Then run the command `npm run build`.
2. Deploy it to `gh-pages` by running command `npm run deploy`
3. To check the demo [Click here](https://an-sudhindra.github.io/NeighborhoodMap/)