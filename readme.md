# Google Maps App

## Specification:
Create an application utilizing the Google Maps API with the Places library. The user should be able to search within the map. A successful search should return a list of results and should display markers on the map for each result. There should be some interaction between the map and the list.

## Screenshot:
![ScreenShot](/dist/images/google_demo.gif)

## How to run this application:
Open the `dist/index.html` file in your browser.

Both the minfied JavaScript bundle and minified CSS were compiled and minified using Webpack.

To build the application from the source files, you will need NPM installed. Then, navigate to the project root and run:

`npm install`
`npm run build`

## Solution:
I created a React-based application to handle the state of the map and display the list of results.

I also configured a build system to compile/transpile and minify the JS/JSX and CSS.

## How to use this application:
When the map loads, the user will be prompted to allow the app to access the user's location. If permission is granted, the map will center on the user's location. If permission is denied, an error window will open on the map.

Once the map is at the desired location, enter a search term and press 'enter' or click the search button. The results will load as markers on the map along with a matching list of locations alongside the map.

When the user hovers over a location in the list, the location on the map is highlighted with a marker. There are options in the list to zoom to a specific location as well as remove any marker/result from the list.

The user also has the option to redo the search in the current map location and to sort the results by rating.
