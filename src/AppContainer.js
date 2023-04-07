import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, Route, useNavigate } from "react-router-dom";

function AppContainer() {

  const navigate = useNavigate();

  useEffect(() => {
    // navigate("/example");
    global.window && (global.window.location.href = '/home.html')
  }, []);

  return (
    <div>


    </div>
  );
}

export default AppContainer;
