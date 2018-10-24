import geolib from "geolib";

const initialSate = {
  position: {
    latitude: 0,
    longitude: 0
  },
  locations: [],
  fetching: false,
  fetchedPosition: {
    latitude: 0,
    longitude: 0
  },
  fetchedDistance: 0,
  heading: 0
};

export default (state = initialSate, action) => {
  switch (action.type) {
    case "APP_INIT":
      return {
        ...state,
        fetching: false
      };
    case "UPDATE_POSITION":
      return {
        ...state,
        position: action.payload,
        locations: calculateDistance(
          state.locations,
          action.payload,
          state.heading
        ),
        fetchedDistance:
          state.fetchedPosition.latitude !== 0 &&
          state.fetchedPosition.longitude !== 0
            ? geolib.getDistance(action.payload, state.fetchedPosition)
            : state.fetchedDistance
      };
    case "FETCH_LOCATIONS_BEGIN":
      return {
        ...state,
        fetching: true
      };
    case "FETCH_LOCATIONS_FAILED":
      alert(action.payload);
      return {
        ...state,
        fetching: false
      };
    case "FETCH_LOCATIONS":
      const locations = state.locations;
      action.payload.data.elements.forEach(item => {
        const itemExists = locations.find(x => x.id === item.id) != null;
        if (!itemExists) {
          locations.push({
            id: item.id,
            name: item.tags.name,
            lat: item.center ? item.center.lat : item.lat,
            lon: item.center ? item.center.lon : item.lon
          });
        }
      });

      return {
        ...state,
        fetchedPosition: action.fetchedPosition,
        fetching: false,
        fetchedDistance: 0,
        locations: calculateDistance(locations, state.position, state.heading)
      };
    case "UPDATE_HEADING":
      return {
        ...state,
        heading: action.payload,
        locations: state.locations.map(x => {
          return {
            ...x,
            bearing: calculateBearing(
              state.position,
              {
                latitude: x.lat,
                longitude: x.lon
              },
              action.payload
            )
          };
        })
      };
    case "MARKER_CLICKED":
      return {
        ...state,
        selectedLocation: action.payload
      };
    default:
      return state;
  }
};

const calculateDistance = (items, position, heading) => {
  return items
    .map(x => {
      return {
        ...x,
        distance: geolib.getDistance(position, {
          latitude: x.lat,
          longitude: x.lon
        }),
        bearing: calculateBearing(
          position,
          {
            latitude: x.lat,
            longitude: x.lon
          },
          heading
        )
      };
    })
    .sort((a, b) => {
      return a.distance - b.distance;
    });
};

const calculateBearing = (currentPosition, locationPosition, heading) => {
  return -360 + heading + geolib.getBearing(currentPosition, locationPosition);
};
