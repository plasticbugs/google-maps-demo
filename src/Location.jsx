import React from 'react';

class Location extends React.Component {
  constructor(props) {
    super(props);
    this.removeThisResult = this.removeThisResult.bind(this);
    this.highlightLocation = this.highlightLocation.bind(this);
    this.removeHighlight = this.removeHighlight.bind(this);
  }

  removeThisResult(event) {
    event.preventDefault();
    this.props.handleRemoveResult(this.props.id);
  }

  highlightLocation() {
    this.props.handleHighlight(this.props.marker);
  }

  removeHighlight() {
    this.props.removeHighlight(this.props.marker);
  }

  render(){
    let ratingValue;
    if (this.props.marker.rating === -1) {
      ratingValue = 'not yet rated';
    } else {
      ratingValue = this.props.marker.rating;
    }
    return (
      <li 
        className="map-location"
        onMouseEnter={this.highlightLocation} 
        onMouseLeave={this.removeHighlight}
      >
        <div className="location-title">
          {this.props.name}
        </div>
        <div className="location-address">
          {this.props.marker.address.map(line => {
            return <p key={line}>{line}</p>;
          })}
        </div>
        <div className="rating">
          Rating: {ratingValue}
        </div>
        <div>
          <a href="#" onClick={(e)=>{
            e.preventDefault();
            this.props.zoomMap(this.props.marker)}
          }>
            Zoom map to this location
          </a>
        </div>
        <a href="#" onClick={this.removeThisResult}>
          Hide this result
        </a>
      </li>
    );
  }
}

module.exports = Location;