import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const RewardSystem = ({ username, userId }) => {
    const [cookies, _] = useCookies(["access_token"]);
    const [cigaretteData, setCigaretteData] = useState([]);

    const fetchDailyConsumptionData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/cigarettes/${userId}`, {
                headers: { authorization: cookies.access_token },
            });
                       
            const extractedDataCigarettes = response.data.cigarettesSmoked.map(entry => ({
                time: new Date(entry.time).toLocaleDateString('en-UK', { year: 'numeric', month: 'numeric', day: 'numeric' }),
                numCigarettes: entry.numCigarettes
            }));

            console.log(extractedDataCigarettes);

            setCigaretteData(extractedDataCigarettes);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDailyConsumptionData();
    }, []);

    return (
    <>
        <div className="rewards-infos-container">
            <div className="rewards-container">
                <span className="points-earned">Points:</span>
            </div>
            <div className="infos-container">
                <span className="infosSymbol"> &#9432; </span>
                <div className="explanation-container">
                    <span className="explanation">For every day you smoke....bla bla bal shvbslvlsv sdhvbLSVHJBldv SHDBLdbhjdv</span>
                </div>
            </div>
        </div>
    </>
    );
}

export default RewardSystem;