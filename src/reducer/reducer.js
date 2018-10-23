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
      return {
        ...state,
        fetchedPosition: action.fetchedPosition,
        fetching: false,
        locations: calculateDistance(
          action.payload.data.elements.map(x => {
            return {
              id: x.id,
              name: x.tags.name,
              lat: x.center ? x.center.lat : x.lat,
              lon: x.center ? x.center.lon : x.lon
            };
          }),
          state.position,
          state.heading
        )
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
