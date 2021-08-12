import React, { useEffect, useState, useCallback } from 'react';
/* --------------------------------- Context -------------------------------- */
const AuthContext = React.createContext({
  token: null,
  isLoggedIn: false,
  logInHandler: (token) => {},
  logOutHandler: () => {},
});
/* ---------------------------- helper functions and variables (global) ---------------------------- */
let timer;
const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const endTime = new Date(expirationTime).getTime();
  return endTime - currentTime;
};

/* ---------------------- AuthContextProvider Component --------------------- */
export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);
  const isLoggedIn = !!token;

  /* -------------------------------- functions ------------------------------- */
  const logInHandler = (token, expirationTime) => {
    console.log(expirationTime);
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime);
    setToken(token);
    const remaningTime = calculateRemainingTime(expirationTime);
    timer = setTimeout(logOutHandler, remaningTime);
  };

  const logOutHandler = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    setToken(null);
    clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (token) {
      const remainingTime = calculateRemainingTime(
        localStorage.getItem('expirationTime')
      );
      console.log(remainingTime);
      timer = setTimeout(logOutHandler, remainingTime);
    }
  }, [token, logOutHandler]);
  /* -------------------------------------------------------------------------- */
  const contextContent = {
    token,
    isLoggedIn,
    logInHandler,
    logOutHandler,
  };

  return (
    <AuthContext.Provider value={contextContent}>
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
