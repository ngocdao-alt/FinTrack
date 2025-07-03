const LineChart = ({ labels = [], dataValues = [] }) => {
  const data = {
    labels: labels.length ? labels : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Income",
        data: dataValues.length
          ? dataValues
          : [5000000, 6000000, 5500000, 7000000, 6500000, 8000000],
        borderColor: "#5D43DB",
        backgroundColor: "rgba(93, 67, 219, 0.2)",
        fill: true,
        tension: 0.4, // đường cong mượt
        pointRadius: 5,
        pointBackgroundColor: "#5D43DB",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw || 0;
            return `${value.toLocaleString()} đ`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString() + " đ";
          },
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
