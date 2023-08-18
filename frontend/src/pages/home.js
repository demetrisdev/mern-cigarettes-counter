import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import LeftContainer from "./components/LeftContainer"; 

export const Home = () => {
  const userId = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state && location.state.username;
  
  return (
    <div className="home">
       <LeftContainer username={username} userId={userId} />
      <div className="right-container">{/* ... */}</div>
    </div>
  );
};