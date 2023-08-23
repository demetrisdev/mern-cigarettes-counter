import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import LeftContainer from "./components/LeftContainer"; 
import CigaretteChart from './components/CigaretteChart';
import PackagesMoneyChart from './components/PackagesMoneyChart'
import NicotineChart from './components/NicotineChart'

export const Home = () => {
  const userId = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const location = useLocation();
  const username = location.state && location.state.username;

  const [refreshFlag, setRefreshFlag] = useState(false);
  
  const handleRefresh = () => {
    setRefreshFlag(prevFlag => !prevFlag);
  };
  
  return (
   <>
      <h1 className="title-welcome">Welcome {username}!</h1>
      <div className="home">
        <LeftContainer username={username} userId={userId} onPostRequest={handleRefresh} />
        <div className="right-container">
          <CigaretteChart username={username} userId={userId} refreshFlag={refreshFlag} />
          <PackagesMoneyChart username={username} userId={userId} refreshFlag={refreshFlag} />
          <NicotineChart username={username} userId={userId} refreshFlag={refreshFlag} />
        </div>
      </div>
    </> 
  );
};