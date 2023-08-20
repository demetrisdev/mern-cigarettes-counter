import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import LeftContainer from "./components/LeftContainer"; 
import CigaretteChart from './components/CigaretteChart';
import 'chart.js';


export const Home = () => {
  const userId = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state && location.state.username;
  
  const [cigaretteData, setCigaretteData] = useState([]);

  const fetchDailyConsumptionData = async () => {
    try {
        const response = await axios.get(`http://localhost:3001/cigarettes/daily-consumption/${userId}`, {
            headers: { authorization: cookies.access_token },
        });

        const extractedData = response.data.cigarettesSmoked.map(entry => ({
            numCigarettes: entry.numCigarettes,
            time: new Date(entry.time).toLocaleDateString('en-UK', { year: 'numeric', month: 'numeric', day: 'numeric' }),
        }));

        const groupedData = {}; // Object to group data by date

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

    } catch (error) {
        console.error(error);
    }
};

fetchDailyConsumptionData();


  return (
    <div className="home">
        <LeftContainer username={username} userId={userId} />
      <div className="right-container">
        <CigaretteChart cigaretteData={cigaretteData} />
      </div>
    </div>
  );
};