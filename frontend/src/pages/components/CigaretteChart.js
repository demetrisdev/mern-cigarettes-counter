import Chart from 'chart.js/auto';
import React from 'react';
import { Line } from "react-chartjs-2";

Chart.register();

const CigaretteChart = ({ cigaretteData }) => {

    const chartData = {
        labels: cigaretteData.map(entry => entry.date),
        datasets: [
            {
                label: 'Daily Cigarette Consumption',
                data: cigaretteData.map(entry => entry.numCigarettes),
                borderColor: 'rgba(255, 0, 0, 0.84)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                text: 'Daily Cigarette Consumption',
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                labels: {
                    font: {
                        weight: 'bold',
                        size: 14
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'category', 
                title: {
                    display: true,
                    text: 'Day of Consumption',
                    font: {
                        weight: 'bold',
                        size: 14
                    },    
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Cigarette Consumption',
                    font: {
                        weight: 'bold',
                        size: 14
                    },    
                },
            },
        },
    };
    
    return (
        <div className="chart-container">
            <Line className='chart'  data={chartData} options={options}/>
        </div>
    );
};

export default CigaretteChart;
