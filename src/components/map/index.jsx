import React, { Component } from "react";
import { Stage, Layer, Circle } from "react-konva";
import { toRadians } from "../../helpers";
import LocationMarker from "./locationMarker";

class Map extends Component {
  render() {
    const size =
      window.innerWidth > window.innerHeight
        ? window.innerHeight
        : window.innerWidth;
    const locations = this.props.locations.slice(0, 10);
    const furthest = locations.length > 0 ? locations.reverse()[0].distance : 0;
    const multiplier = size / 2 / (furthest + 100);
    const items = locations.map(item => {
      return {
        id: item.id,
        distance: item.distance,
        x: item.distance * Math.sin(toRadians(item.bearing)) * multiplier,
        y: item.distance * Math.cos(toRadians(item.bearing)) * multiplier,
        label: item.name + " - " + item.distance + "m"
      };
    });

    return (
      <Stage width={size} height={size}>
        <Layer offsetX={-(size / 2)} offsetY={-(size / 2)}>
          <Circle x={0} y={0} width={10} height={10} fill={"black"} />
          {items.map(item => {
            return (
              <LocationMarker
                key={item.id}
                x={item.x}
                y={item.y}
                label={item.label}
              />
            );
          })}
        </Layer>
      </Stage>
    );
  }
}

export default Map;
