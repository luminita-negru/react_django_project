import { Line } from 'react-chartjs-2';
import React from 'react';

function StockChart({ data }) {
  const chartData = {
    labels: Object.keys(data),
    datasets: [{
      label: 'Stock Price',
      data: Object.values(data),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  return <Line data={chartData} />;
}

export default StockChart;
