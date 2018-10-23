import React from "react";

export default props => {
  return (
    <div>
      <pre>{JSON.stringify(props.data.fetching)}</pre>
      <pre>{JSON.stringify(props.data.fetchedDistance)}</pre>
      <pre>{JSON.stringify(props.data.position)}</pre>
      <pre>{JSON.stringify(props.data.heading)}</pre>
      <pre>
        {props.data.locations.slice(0, 10).map((x, i) => (
          <p key={i}>
            {x.name + " " + x.distance + "m " + x.bearing.toFixed(0) + "degs"}
          </p>
        ))}
      </pre>
    </div>
  );
};
