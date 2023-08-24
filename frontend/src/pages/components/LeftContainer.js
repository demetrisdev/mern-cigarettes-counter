import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import RewardSystem from './RewardSystem'

const LeftContainer = ({ username, userId, onPostRequest }) => {
    const [cookies, setCookie, removeCookie ] = useCookies(["access_token"]);
    const navigate = useNavigate();
    const location = useLocation();
    const currentDate = new Date();

    const [refreshPage, setRefreshPage] = useState(false);

    const refreshingPage = () => {
      setRefreshPage(prevPage => !prevPage);
    };

    const initialCigaretteState = {
      cigarettesBrand: "",
      price: "",
      nicotineLevel: "",
      time: currentDate,
      userOwner: userId,
    };
  
    const [cigarette, setCigarette] = useState({
      cigarettesBrand: "",
      price: "",
      nicotineLevel: "",
      time: currentDate,
      userOwner: userId,
    });
  
    const [selectedPackage, setSelectedPackage] = useState("");
    const [numCigarettes, setNumCigarettes] = useState("");
  
    const [cigarettePackages, setCigarettePackages] = useState([]); 

    const fetchCigarettePackages = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/cigarettes/${userId}`, {
          headers: { authorization: cookies.access_token },
        });
  
        setCigarettePackages(response.data.savedCigarettes);
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
      fetchCigarettePackages();
    }, [userId, cookies.access_token]);
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setCigarette((prevCigarette) => ({
        ...prevCigarette,
        [name]: value,
      }));
    };
  
    const handleDecimal = (event) => {
      const { name, value } = event.target;
  
      // Validate input to allow only valid decimal numbers
      if (/^\d*\.?\d*$/.test(value)) {
        setCigarette((prevCigarette) => ({
          ...prevCigarette,
          [name]: value,
        }));
      }
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
          await axios.post("http://localhost:3001/cigarettes", cigarette, {
              headers: { authorization: cookies.access_token },
          });
  
          alert("Package Added");
          fetchCigarettePackages();
          setCigarette(initialCigaretteState);
          onPostRequest(); // Add this line
          console.log("handlePostRequest called"); // Add this line
      } catch (error) {
          console.error(error);
      }
  };
  
  const handleAddCigaretteSubmit = async (event) => {
      event.preventDefault();
  
      // Check if numCigarettes is not empty, is a valid whole number, and is greater than 0
      if (!numCigarettes || isNaN(numCigarettes) || !Number.isInteger(parseFloat(numCigarettes)) || parseInt(numCigarettes) <= 0) {
          alert("Invalid number!");
          return;
      }
  
      try {
          await axios.post("http://localhost:3001/cigarettes/addcigarette", {
              cigarettePackage: selectedPackage,
              numCigarettes: numCigarettes,
              time: currentDate,
              userOwner: userId,
          }, {
              headers: { authorization: cookies.access_token },
          });
  
          alert("Cigarettes Added");
          setSelectedPackage("");
          setNumCigarettes("");
          onPostRequest();
          console.log("handlePostRequest called");
      } catch (error) {
          console.error(error);
      }
  };
    
  const exitRoom = () => {
    removeCookie("access_token", { path: "/" }); 
    localStorage.clear();
    window.history.replaceState(null, "", "/"); //
    navigate("/");
  }
  
  return (
    <div className="left-container">
      <div className="title-logout-container">
        <button onClick={exitRoom} className='button-logOut'>Log Out</button>
      </div>
        <div className="create-cigarettes-container">
          <form className="create-cigarettes-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Cigarettes Brand</label>
            <input
              type="text"
              id="name"
              name="cigarettesBrand"
              value={cigarette.cigarettesBrand}
              onChange={handleChange}
            />
            <label htmlFor="price">Price</label>
            <input
              type="number"
              step="0.01" 
              id="price"
              name="price"
              value={cigarette.price}
              onChange={handleDecimal}
            />
            <label htmlFor="nicotine">Nicotine</label>
            <input
              type="number"
              step="0.01" 
              id="nicotine"
              name="nicotineLevel"
              value={cigarette.nicotineLevel}
              onChange={handleDecimal}
            />
            <button className="btn-submit" type="submit">Add Package</button>
          </form>
        </div>
        <div className="add-cigarettes-container">
          <form className="add-cigarettes-form" onSubmit={handleAddCigaretteSubmit}>
            <label htmlFor="selectedPackage">Select a package</label>
            <select 
              id="selectedPackage" 
              name="selectedPackage" 
              value={selectedPackage} 
              onChange={(e) => setSelectedPackage(e.target.value)}   
              >
              <option value="">Select a package</option>
              {cigarettePackages.map((cigarettePackage) => (
                <option key={cigarettePackage._id} value={cigarettePackage.cigarettesBrand}>
                  {cigarettePackage.cigarettesBrand}
                </option>
              ))}
            </select>
            {selectedPackage && (
              <>
                <label htmlFor="numCigarettes">Number of cigarettes</label>
                <input
                  type="number"
                  id="numCigarettes"
                  name="numCigarettes"
                  value={numCigarettes}
                  onChange={(e) => setNumCigarettes(e.target.value)}
                />
                <button
                  className="btn-add-cigarette"
                  type="submit"
                  onClick={handleAddCigaretteSubmit}
                >
                  Add Cigarettes
                </button>
              </>
            )}
          </form>
        </div>
        <RewardSystem username={username} userId={userId} refreshingPage={refreshingPage} />
      </div>
  );
};

export default LeftContainer;