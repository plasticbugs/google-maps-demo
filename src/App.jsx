import React from 'react';
import ReactDOM from 'react-dom';
import Location from './Location.jsx';
import GoogleMapsLoader from 'google-maps';
import { createStore } from 'redux';

var map, infoWindow, service;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recentSearch: '',
      searchField: '',
      markers: [],
      infowindow: null,
      isLoading: false
    }
    this.createMarker           = this.createMarker.bind(this);
    this.handleKeypress         = this.handleKeypress.bind(this);
    this.handleRemoveResult     = this.handleRemoveResult.bind(this);
    this.handleHighlight        = this.handleHighlight.bind(this);
    this.removeHighlight        = this.removeHighlight.bind(this);
    this.performLocationSearch  = this.performLocationSearch.bind(this);
    this.handleInputChange      = this.handleInputChange.bind(this);
    this.handleSubmit           = this.handleSubmit.bind(this);
    this.sortByRating           = this.sortByRating.bind(this);
  }

  componentDidMount() {
    GoogleMapsLoader.LIBRARIES = ['places'];
    GoogleMapsLoader.load( google => {
      map = new google.maps.Map(document.getElementById('map'), {
        // center on SF
        center: {lat: 37.781, lng: -122.411},
        zoom: 12
      });
      infoWindow = new google.maps.InfoWindow;
      service = new google.maps.places.PlacesService(map);

      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( position => {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          map.setCenter(pos);
        }, () => {
          this.handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        this.handleLocationError(false, infoWindow, map.getCenter());
      }
    });
  }
  
  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

  createMarker(place) {
    var placeLoc = place.geometry.location;
    let address = place.formatted_address.split(',').slice(0,2);
    let image = './images/marker.png';
    const MARKER_SIZE = 32;

    if(place.rating === undefined) {
      place.rating = -1;
    }

    var marker = new google.maps.Marker({
      map: map,
      position: placeLoc,
      title: place.name,
      address,
      id: place.place_id,
      rating: place.rating,
      icon: {
        url: image,
        scaledSize: new google.maps.Size(MARKER_SIZE, MARKER_SIZE)
      }
    });

    let infoContent = this.createMarkerContent(marker);

    google.maps.event.addListener( marker, 'click', function() {
      infoWindow.setContent(infoContent);
      infoWindow.open(map, this);
    });
    return marker;
  }

  createMarkerContent(marker) {
    let infoContent = document.createElement('div');
    let infoTitle = document.createElement('p');
    infoTitle.innerText = marker.title;
    let infoAddress = document.createElement('div')
    for(let i = 0; i < marker.address.length; i++) {
      let line = document.createElement('p');
      line.innerText = marker.address[i];
      infoAddress.appendChild(line);
    }
    
    infoTitle.setAttribute( 'class', 'location-title marker' );
    infoAddress.setAttribute( 'class', 'location-address marker' );

    infoContent.appendChild(infoTitle);
    infoContent.appendChild(infoAddress);
    return infoContent;
  }

  performLocationSearch(query) {
    if(query.length > 0) {
      // clear current markers
      this.state.markers.forEach( marker => {
        marker.setMap(null);
      });
      this.setState( {isLoading: true, markers: [], recentSearch: query} );

      service.textSearch( {query, bounds: map.getBounds() }, (results, status)=>{
        this.setState( {isLoading: false} )
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          let markerArray = [];
          for(let i = 0; i < results.length; i++) {
            let newMarker = this.createMarker( results[i] );
            markerArray.push(newMarker);
          }
          this.setState( {markers: markerArray} );
        }
      });
    }
  }

  handleKeypress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      let query = this.state.searchField;
      this.setState( {searchField: ''} );
      this.performLocationSearch(query);
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    let query = this.state.searchField;
    this.setState( {searchField: ''} );
    this.performLocationSearch(query);
  }

  handleInputChange(e) {
    let input = e.target.value
    this.setState( {searchField: input} );
  }

  zoomMap(marker) {
    const ZOOM_IN = 21
    map.setZoom(ZOOM_IN);
    map.setCenter( marker.getPosition() );
  }

  handleHighlight(marker) {
    let markers = this.state.markers;
    for(let i = 0; i < markers.length; i++) {
      if(markers[i].id === marker.id) {
        let infoContent = this.createMarkerContent(marker);
        let infowindow = new google.maps.InfoWindow({
          content: infoContent
        });
        this.setState({infowindow: infowindow}, ()=> {
          infowindow.open( map, marker );
        });
      }
    }
  }
  
  removeHighlight(marker) {
    this.state.infowindow.close();
    this.setState( {infowindow: null} );
  }

  sortByRating(e) {
    e.preventDefault();
    let sortedMarkers = this.state.markers.slice();
    sortedMarkers.sort((a, b) => {
      return b.rating - a.rating;
    })
    this.setState( {markers: sortedMarkers} );
  }

  handleRemoveResult(markerId) {
    let markerCopy = this.state.markers.slice();

    for(let i = 0; i < markerCopy.length; i++) {
      if(markerCopy[i].id === markerId) {
        markerCopy[i].setMap(null);
        markerCopy = markerCopy.slice( 0, i )
                    .concat( markerCopy.slice( i + 1, markerCopy.length ) );
        break;
      }
    }
    this.setState({markers: markerCopy});
  }

  render() {
    let recentSearch;
    if(this.state.recentSearch) {
      recentSearch = (
        <div className="search-message">
          Showing results for <span className="search-query">{this.state.recentSearch}</span> - <a href="#" onClick={this.sortByRating}>Sort by rating</a><br/>
          <button type="button" className="redo-search" onClick={()=>{this.performLocationSearch(this.state.recentSearch)}}>
            Redo search in current map area
          </button>
        </div>
      );
    }

    let locations;
    if(this.state.isLoading) {
      // display spinner
      locations = (
        <div className="search-message loader">
          <img src="./images/ajax-loader.gif" />
        </div>
      );
    } else {
      // display results
      locations = (
        <div>
          {recentSearch}
          <ul className="location-list">
            {this.state.markers.map(marker => {
              return (
                <Location 
                  key={marker.id} 
                  name={marker.title} 
                  id={marker.id}
                  marker={marker}
                  handleRemoveResult={this.handleRemoveResult}
                  handleHighlight={this.handleHighlight}
                  removeHighlight={this.removeHighlight}
                  zoomMap={this.zoomMap}
                />
              );
            })}
          </ul>
        </div>
      );
    }
    return (
      <div>
        <form>
          <input
            className="search-field"
            placeholder="Search map"
            onKeyPress={this.handleKeypress}
            onChange={this.handleInputChange}
            value={this.state.searchField}
          ></input>
          <input type="submit" value="Search" className="submit-button" onClick={this.handleSubmit}>
          </input>
        </form>
        {locations}
      </div>
    );
  }
}

module.exports = App;
