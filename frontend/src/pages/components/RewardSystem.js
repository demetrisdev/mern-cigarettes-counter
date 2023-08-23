import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const RewardSystem = ({ username, userId, refreshFlag }) => {
    const [cookies, _] = useCookies(["access_token"]);
    const [cigaretteData, setCigaretteData] = useState([]);
    const [points, setPoints] = useState(0); 

    const [explanationVisible, setExplanationVisible] = useState(false);

    const handleMouseEnter = () => {
        setExplanationVisible(true);
    };

    const handleMouseLeave = () => {
        setExplanationVisible(false);
    };

    const fetchDailyConsumptionData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/cigarettes/${userId}`, {
                headers: { authorization: cookies.access_token },
            });
    
            const extractedDataCigarettes = response.data.cigarettesSmoked.map(entry => ({
                time: new Date(entry.time).toLocaleDateString('en-UK', { year: 'numeric', month: 'numeric', day: 'numeric' }),
                numCigarettes: entry.numCigarettes
            }));
    
            const groupedData = {};
    
            extractedDataCigarettes.forEach(entry => {
                if (!groupedData[entry.time]) {
                    groupedData[entry.time] = 0;
                }
                groupedData[entry.time] += entry.numCigarettes;
            });
    
            const combinedArray = Object.entries(groupedData).map(([date, numCigarettes]) => ({
                date,
                numCigarettes,
            }));
    
            let points = 0;
    
            combinedArray.forEach((entry, index) => {
                const previousEntry = combinedArray[index - 1];
    
                if (entry.numCigarettes < 15) {
                    if (previousEntry && (previousEntry.numCigarettes - entry.numCigarettes) > 3) {
                        points += 3;
                    }
                }
                
                if (previousEntry && previousEntry.numCigarettes === entry.numCigarettes) {
                    points += 2;
                }
    
                if (previousEntry && (entry.numCigarettes - previousEntry.numCigarettes) >= 3) {
                    points -= 2;
                }
            });

            setPoints(points);

            setCigaretteData(combinedArray);
    
        } catch (error) {
            console.error(error);
        }
    };
    
    useEffect(() => {
        fetchDailyConsumptionData();
    }, [userId, refreshFlag]);
    
    return (
    <>
        <div className="rewards-infos-container">
            <div className="rewards-container">
                <span className="points-earned">Points: {points}</span>
            </div>
            <div className="infos-container">
                <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="infoSymbol"> &#9432; </span>
                <div className={`explanation-container ${explanationVisible ? 'explanation-visible' : ''}`}>
                    <ul className="explanation">
                        <li>If cigarettes smoked decreased by 3 or more, 4 points awarded.</li>   
                        <li>If cigarettes smoked increased by 3 or more, 4 points reduction.</li> 
                        <li>If cigarettes smoked stayed the same, 2 points awarded.</li>
                        <li>If cigarettes smoked are more than 15, no points are awarded.</li>
                    </ul>
                </div>
            </div>
        </div>
    </>
    );
}

export default RewardSystem;