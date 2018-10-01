import React, { Component } from "react";
import { connect } from "react-redux";
import Radar from "./components/radar";
import logo from "./logo.svg";
import "./App.css";

import { updatePosition, fetchLocations } from "./actions/actions";

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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <pre>{JSON.stringify(this.props.fetching)}</pre>
        <pre>{JSON.stringify(this.props.fetchedDistance)}</pre>
        <pre>{JSON.stringify(this.props.position)}</pre>
        {this.props.locations.slice(0, 10).map((x, i) => (
          <p key={i}>
            {x.name + " " + x.distance + "m " + x.bearing.toFixed(0) + "degs"}
          </p>
        ))}
        <Radar locations={this.props.locations} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  position: state.reducer.position,
  locations: state.reducer.locations,
  fetchedDistance: state.reducer.fetchedDistance,
  fetching: state.reducer.fetching
});

const mapDispatchToProps = dispatch => ({
  updatePosition: position => dispatch(updatePosition(position)),
  fetchLocations: position => dispatch(fetchLocations(position))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
