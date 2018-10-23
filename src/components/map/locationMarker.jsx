import React from "react";
import { Circle, Text, Group } from "react-konva";

export default props => {
  return (
    <Group onClick={() => props.onClick(props.id)}>
      <Circle x={props.x} y={-props.y} width={10} height={10} fill={"green"} />
      <Text x={props.x} y={-props.y + 5} text={props.label} />
    </Group>
  );
};
