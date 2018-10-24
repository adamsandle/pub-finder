import axios from "axios";

export const init = () => dispatch => {
  dispatch({
    type: "APP_INIT"
  });
};

export const updatePosition = position => dispatch => {
  dispatch({
    type: "UPDATE_POSITION",
    payload: position
  });
};

export const fetchLocations = position => dispatch => {
  dispatch({
    type: "FETCH_LOCATIONS_BEGIN"
  });
  axios
    .get(
      "https://overpass-api.de/api/interpreter?data=[out:json];(node[amenity=pub](around:5000," +
        position.latitude +
        "," +
        position.longitude +
        ");way[amenity=pub](around:5000," +
        position.latitude +
        "," +
        position.longitude +
        ");node[amenity=bar](around:5000," +
        position.latitude +
        "," +
        position.longitude +
        ");way[amenity=bar](around:5000," +
        position.latitude +
        "," +
        position.longitude +
        "););out center;"
    )
    .then(result => {
      dispatch({
        type: "FETCH_LOCATIONS",
        payload: result,
        fetchedPosition: position
      });
    })
    .catch(result => {
      dispatch({
        type: "FETCH_LOCATIONS_FAILED",
        payload: result
      });
    });
};

export const updateHeading = heading => dispatch => {
  dispatch({
    type: "UPDATE_HEADING",
    payload: heading
  });
};

export const markerClicked = locationId => dispatch => {
  dispatch({
    type: "MARKER_CLICKED",
    payload: locationId
  });
};

export const favourite = locationId => dispatch => {
  dispatch({
    type: "FAVOURITE",
    payload: locationId
  });
};
