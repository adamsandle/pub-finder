import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "./components/header";
import Map from "./components/map";
import DebugInfo from "./components/debugInfo";
import FavouritesModal from "./components/favouritesModal";
import { Button, Icon } from "semantic-ui-react";
import "./App.css";

import {
  init,
  updatePosition,
  fetchLocations,
  updateHeading,
  markerClicked,
  favourite
} from "./actions/actions";

class App extends Component {
  state = { favouritesModalOpen: false };
  componentDidMount() {
    this.props.init();
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
      (nextProps.fetchedDistance >= 50 || nextProps.locations.length === 0) &&
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
        {this.props.selectedLocation && (
          <Button color="red" onClick={() => this.props.markerClicked(null)}>
            <Icon name="checkmark" /> End Navigation
          </Button>
        )}
        {this.props.selectedLocation && (
          <Button
            color="blue"
            onClick={() => this.props.favourite(this.props.selectedLocation)}
          >
            <Icon name="checkmark" />{" "}
            {this.props.locations.find(x => x.id == this.props.selectedLocation)
              .favourite
              ? "Remove "
              : "Add "}
            Favourite
          </Button>
        )}
        <Button
          color="green"
          onClick={() =>
            this.setState({
              favouritesModalOpen: !this.state.favouritesModalOpen
            })
          }
        >
          <Icon name="checkmark" /> View Favourites
        </Button>
        <Map
          locations={this.props.locations}
          selectedLocation={this.props.selectedLocation}
          onMarkerClick={this.markerClicked}
        />
        <FavouritesModal
          open={this.state.favouritesModalOpen}
          handleClose={() =>
            this.setState({
              favouritesModalOpen: false
            })
          }
          locations={this.props.locations.filter(x => x.favourite)}
          onSelect={locationId => {
            this.props.markerClicked(locationId);
            this.setState({
              favouritesModalOpen: false
            });
          }}
          onRemove={locationId => this.props.favourite(locationId)}
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
  init: () => dispatch(init()),
  updatePosition: position => dispatch(updatePosition(position)),
  fetchLocations: position => dispatch(fetchLocations(position)),
  updateHeading: heading => dispatch(updateHeading(heading)),
  markerClicked: locationId => dispatch(markerClicked(locationId)),
  favourite: locationId => dispatch(favourite(locationId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
