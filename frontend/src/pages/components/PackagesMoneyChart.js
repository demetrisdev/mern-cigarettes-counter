import Chart from 'chart.js/auto';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Bar } from "react-chartjs-2";

Chart.register();

const PackagesMoneyChart = ({ username, userId }) => {
    const [cookies, _] = useCookies(["access_token"]);
    const [cigaretteData, setCigaretteData] = useState([]);

    const fetchDailyConsumptionData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/cigarettes/${userId}`, {
                headers: { authorization: cookies.access_token },
            });

            const extractedData = response.data.savedCigarettes.map(entry => ({
                price: entry.price,
                time: new Date(entry.time).toLocaleDateString('en-UK', { year: 'numeric', month: 'numeric' }),
            }));

            const groupedData = {};

            extractedData.forEach(entry => {
                if (!groupedData[entry.time]) {
                    groupedData[entry.time] = 0;
                }
                groupedData[entry.time] += entry.price;
            });

            const combinedArray = Object.entries(groupedData).map(([time, price]) => ({
                time,
                price,
            }));

            setCigaretteData(combinedArray);

            const chartData = {
                labels: combinedArray.map(entry => entry.time),
                datasets: [
                    {
                        label: 'Monthly Cost of Smoking in Euros',
                        data: combinedArray.map(entry => entry.price),
                        borderColor: 'rgba(255, 0, 0, 0.50)',
                        backgroundColor: 'rgba(255, 0, 0, 0.50)',
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
                            text: 'Month',
                            font: {
                                weight: 'bold',
                                size: 14
                            },    
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Cost of Packages',
                            font: {
                                weight: 'bold',
                                size: 14
                            },    
                        },
                    },
                },
            };

            // Render the chart
            const ctx = document.getElementById('moneyChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: options,
            });

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDailyConsumptionData();
    }, []);

    return (
        <div className="chart-container-money">
            <canvas id="moneyChart" className='chart-money'></canvas>
        </div>
    );
}

export default PackagesMoneyChart;
