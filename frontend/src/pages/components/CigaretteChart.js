import Chart from 'chart.js/auto';
import React from 'react';
import { Line } from "react-chartjs-2";

Chart.register();

const CigaretteChart = ({ cigaretteData }) => {

    const chartData = {
        labels: Object.keys(cigaretteData),
        datasets: [
            {
                label: 'Daily Cigarette Consumption',
                data: Object.values(cigaretteData).map(entry => entry.numCigarettes),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    const options = {
        scales: {
            x: {
                type: 'category', // Use the 'category' scale for the x-axis
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Cigarette Consumption',
                },
            },
        }, 
    };

    return (
        <div className="chart-container">
            <Line data={chartData} options={options}/>
        </div>
    );
};

export default CigaretteChart;