import Chart from 'chart.js/auto';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const NicotineChart = ({ username, userId, refreshFlag }) => {
    const [cookies, _] = useCookies(["access_token"]);
    const [cigaretteData, setCigaretteData] = useState([]);
    const [chartInstance, setChartInstance] = useState(null);

    const fetchDailyConsumptionData = async () => {
        try {
            if (chartInstance) {
                chartInstance.destroy();
            }
            const response = await axios.get(`http://localhost:3001/cigarettes/${userId}`, {
                headers: { authorization: cookies.access_token },
            });

            const extractedData = response.data.savedCigarettes.map(entry => ({
                cigarettesBrand: entry.cigarettesBrand,
                nicotineLevel: entry.nicotineLevel,
            }));
                       
            const extractedDataCigarettes = response.data.cigarettesSmoked.map(entry => ({
                cigarettePackage: entry.cigarettePackage,
                time: new Date(entry.time).toLocaleDateString('en-UK', { year: 'numeric', month: 'numeric', day: 'numeric' }),
                numCigarettes: entry.numCigarettes
            }));

            for (const cigaretteEntry of extractedDataCigarettes) {
                const matchingDataEntry = extractedData.find(dataEntry => dataEntry.cigarettesBrand === cigaretteEntry.cigarettePackage);
                if (matchingDataEntry) {
                    cigaretteEntry.nicotineLevel = matchingDataEntry.nicotineLevel;
                }
            }

            const groupedData = extractedDataCigarettes.reduce((result, entry) => {
                const date = entry.time;
                const nicotineLevel = entry.nicotineLevel;
                const numCigarettes = entry.numCigarettes;

                if (!result[date]) {
                    result[date] = {
                        date: date,
                        totalNicotineIntake: +(nicotineLevel * numCigarettes).toFixed(2), 
                    };
                } else {
                    result[date].totalNicotineIntake += +(nicotineLevel * numCigarettes).toFixed(2);
                }

                return result;
            }, {});

            const groupedDataArray = Object.values(groupedData);

            setCigaretteData(groupedDataArray);

            const chartData = {
                labels: groupedDataArray.map(entry => entry.date),
                datasets: [
                    {
                        label: 'Daily Intake of Nicotine in mg',
                        
                        data: groupedDataArray.map(entry => entry.totalNicotineIntake),
                        borderColor: 'rgba(255, 0, 0, 0.50)',
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 205, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(201, 203, 207, 0.2)'
                          ],
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
                        title: {
                            display: true,
                            text: 'Date',
                            font: {
                                weight: 'bold',
                                size: 14
                            },    
                        },
                    },
                    y: {
                        title: { 
                            display: true,
                            text: 'Nicotine Intake',
                            font: {
                                weight: 'bold',
                                size: 14
                            },    
                        },
                    },
                },
            };

            const ctx = document.getElementById(`nicotineChart-${userId}`).getContext('2d');
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
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [userId, refreshFlag]);

    return (
        <div className="chart-container-money">
            <canvas id={`nicotineChart-${userId}`}  className='chart-money'></canvas>
        </div>
    );
}

export default NicotineChart;