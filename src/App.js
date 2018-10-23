import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "./components/header";
import Map from "./components/map";
import DebugInfo from "./components/debugInfo";
import "./App.css";

import {
  updatePosition,
  fetchLocations,
  updateHeading,
  markerClicked
} from "./actions/actions";

class App extends Component {
  componentDidMount() {
    navigator.geolocation.watchPosition(
      position => {
        this.props.updatePosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    if ("ondeviceorientationabsolute" in window) {
      window.addEventListener("deviceorientationabsolute", eventData => {
        this.props.updateHeading(eventData.alpha);
      });
    } else if ("ondeviceorientation" in window) {
      window.addEventListener("ondeviceorientation", eventData => {
        this.props.updateHeading(eventData.alpha);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      (((this.props.position.latitude !== nextProps.position.latitude ||
        this.props.position.longitude !== nextProps.position.longitude) &&
        nextProps.locations.length === 0) ||
        this.props.fetchedDistance >= 50) &&
      !nextProps.fetching
    ) {
      this.props.fetchLocations(nextProps.position);
    }
  }

  markerClicked = locationId => {
    this.props.markerClicked(locationId);
  };

  render() {
    return (
      <div className="App">
        <Header />
        <DebugInfo data={this.props} />
        <Map
          locations={this.props.locations}
          selectedLocation={this.props.selectedLocation}
          onMarkerClick={this.markerClicked}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  position: state.reducer.position,
  locations: state.reducer.locations,
  fetchedDistance: state.reducer.fetchedDistance,
  fetching: state.reducer.fetching,
  heading: state.reducer.heading,
  selectedLocation: state.reducer.selectedLocation
});

const mapDispatchToProps = dispatch => ({
  updatePosition: position => dispatch(updatePosition(position)),
  fetchLocations: position => dispatch(fetchLocations(position)),
  updateHeading: heading => dispatch(updateHeading(heading)),
  markerClicked: locationId => dispatch(markerClicked(locationId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
