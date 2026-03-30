import React from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";

const ChartContainer = React.memo(({ graphData }) => {
  if (!graphData?.data?.datasets) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>No chart data available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {graphData.chartType === "line" && (
        <Line data={graphData.data} options={graphData.options} />
      )}
      {graphData.chartType === "bar" && (
        <Bar data={graphData.data} options={graphData.options} />
      )}
      {graphData.chartType === "pie" && (
        <Pie data={graphData.data} options={graphData.options} />
      )}
      {graphData.chartType === "doughnut" && (
        <Doughnut data={graphData.data} options={graphData.options} />
      )}
    </>
  );
});

export default ChartContainer;