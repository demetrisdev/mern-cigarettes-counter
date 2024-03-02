import React, { useState } from "react";

import LoginRegisterModal from "./components/LoginRegisterModal";
import companyLogo from '../public/images/logo-image.png';
import screenshots from '../public/images/screenshots.png';

import "./auth.css";

export const Auth = () => {
  const [modal, setModal] = useState(false);

  return (
    <>
      <LoginRegisterModal
        openModal={modal}
        closeModal={() => setModal(false)}
      />
      <div className="logo-container">
        <h1>QuitSmoke</h1>
        <img src={companyLogo} alt="QuitSmokeLoggo"/>
      </div>
      <div className="main-container">
        <div className="welcoming-container">
          <h4> Powerfull API to help you stop smoking</h4>
          <p>
            Let us help you in this journey, <strong>you can do it!</strong>
            <br/>Start reducing your
            cigarette intakes with this powefull app... <br/> You have the power... 
            we will just help you along the way!
          </p>
          <h5>👇 Simply Login or Register</h5>
          <button onClick={() => setModal(true)} >Enter</button>
        </div>
        <div className="screenshot-container">
          <img src={screenshots} alt="System"/>
        </div>
      </div>
    </>
  );
};
