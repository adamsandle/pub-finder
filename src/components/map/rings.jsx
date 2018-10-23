import React from "react";
import { Circle, Text, Group } from "react-konva";

export default props => {
  const { scale, distance, stageSize } = props;
  const rings = getRings(distance).filter(x => x * scale * 2 < stageSize);
  return (
    <Group>
      {rings.map((ring, i) => {
        return (
          <Group key={i}>
            <Text x={-10} y={-ring * scale - 15} text={ring + "m"} />
            <Circle
              x={0}
              y={0}
              width={ring * scale * 2}
              height={ring * scale * 2}
              stroke={"black"}
              strokeWidth={1}
            />
          </Group>
        );
      })}
    </Group>
  );
};

const getRings = distance => {
  let results = [];
  let interval;
  let x = 0;
  if (distance < 250) {
    interval = 50;
  } else if (distance < 500) {
    interval = 100;
  } else if (distance < 1500) {
    interval = 250;
  } else if (distance < 2500) {
    interval = 500;
  } else if (distance < 10000) {
    interval = 1000;
  } else {
    interval = 10000;
  }
  while (x <= distance) {
    x = x + interval;
    results.push(x);
  }
  return results;
};
