import Chart from 'chart.js/auto';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

Chart.register();

const CigaretteChart = ({ username, userId, refreshFlag }) => {
    const [cookies, _] = useCookies(["access_token"]);
    const [cigaretteData, setCigaretteData] = useState([]);
    const [chartInstance, setChartInstance] = useState(null);

    const fetchDailyConsumptionData = async () => {
        try {
            if (chartInstance) {
                chartInstance.destroy();
            }
            const response = await axios.get(`http://localhost:3001/cigarettes/daily-consumption/${userId}`, {
                headers: { authorization: cookies.access_token },
            });
    
            const extractedData = response.data.cigarettesSmoked.map(entry => ({
                numCigarettes: entry.numCigarettes,
                time: new Date(entry.time).toLocaleDateString('en-UK', { year: 'numeric', month: 'numeric', day: 'numeric' }),
            }));
    
            const groupedData = {};
    
            extractedData.forEach(entry => {
                if (!groupedData[entry.time]) {
                    groupedData[entry.time] = 0;
                }
                groupedData[entry.time] += entry.numCigarettes;
            });
    
            const combinedArray = Object.entries(groupedData).map(([date, numCigarettes]) => ({
                date,
                numCigarettes,
            }));

            setCigaretteData(combinedArray);

            const chartData = {
                labels: combinedArray.map(entry => entry.date),
                datasets: [
                    {
                        label: 'Daily Cigarette Consumption',
                        data: combinedArray.map(entry => entry.numCigarettes),
                        borderColor: 'rgba(255, 0, 0, 0.50)',
                        backgroundColor: 'rgba(255, 255, 255, 1)',
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
                    },
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

            const ctx = document.getElementById(`cigaretteChart-${userId}`).getContext('2d');
            const newChartInstance = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: options,
            });
            setChartInstance(newChartInstance);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDailyConsumptionData();
        return () => {
            // Clean up the chart instance when the component unmounts
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [userId, refreshFlag]);


    return (
        <div className="chart-container">
             <canvas id={`cigaretteChart-${userId}`}  className='chart' />
        </div>
    );
};

export default CigaretteChart;