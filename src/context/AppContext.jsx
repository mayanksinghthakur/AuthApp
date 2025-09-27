import { createContext, useEffect, useState } from "react";
import AppConstants from "../util/constants";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
  const backendURL = AppConstants.BACEND_URL;
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [userData, setuserData] = useState(null); // Changed from false to null

  const getUserData = async () => {
    try {
      const response = await axios.get(backendURL + "/profile");
      if (response.status === 200) {
        setuserData(response.data);
      } else {
        toast.error("unable to reteive profile");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const contextValue = {
    backendURL,
    isLoggedIn,
    setisLoggedIn,
    userData,
    setuserData,
    getUserData,
  };

  //for avoiding refresh when user is logged in
  const getAuthState = async () => {
    try {
      //getting boolean from the url weather the data is true
      const response = await axios.get(backendURL + "/is-authenticated");
      if (response.status === 200 && response.data === true) {
        setisLoggedIn(true);
        await getUserData();
      } else {
        setisLoggedIn(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};
