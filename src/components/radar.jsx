import React from "react";
import { Scatter } from "react-chartjs-2";
import { toRadians } from "../helpers";

const Radar = props => {
  const data = {
    labels: ["Scatter"],
    datasets: [
      {
        label: "Locations",
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 10,
        pointHitRadius: 10,
        data: props.locations
          .slice(0, 10)
          .sort((a, b) => {
            return a.id - b.id;
          })
          .map(item => {
            return {
              x: item.distance * Math.sin(toRadians(item.bearing)),
              y: item.distance * Math.cos(toRadians(item.bearing)),
              label: item.name + " - " + item.distance + "m"
            };
          })
      },
      {
        label: "here",
        fill: false,
        backgroundColor: "rgba(0,0,0,0.4)",
        pointBorderColor: "rgba(0,0,0,1)",
        pointBackgroundColor: "rgba(0,0,0,1)",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(0,0,0,1)",
        pointHoverBorderColor: "rgba(0,0,0,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 10,
        pointHitRadius: 10,
        data: [{ x: 0, y: 0, label: "You are here" }]
      }
    ]
  };
  const values = [];
  data.datasets[0].data.forEach(element => {
    values.push(element.x);
    values.push(element.y);
  });

  const maxValue = values
    .map(x => {
      return x < 0 ? x * -1 : x;
    })
    .sort((a, b) => {
      return b - a;
    })[0];

  const options = {
    legend: {
      display: false
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          return data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
            .label;
        }
      }
    },
    scales: {
      yAxes: [
        {
          gridLines: {
            drawBorder: false,
            display: false
          },
          ticks: {
            min: -maxValue,
            max: maxValue,
            display: false
          }
        }
      ],
      xAxes: [
        {
          gridLines: {
            drawBorder: false,
            display: false
          },
          ticks: {
            min: -maxValue,
            max: maxValue,
            display: false
          }
        }
      ]
    }
  };
  return <Scatter data={data} options={options} />;
};

export default Radar;
