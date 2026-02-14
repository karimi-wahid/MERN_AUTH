import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backEndUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const getUserData = async () => {
    try {
      console.log("Fetching user data from:", `${backEndUrl}/api/user/data`);
      const response = await axios.get(`${backEndUrl}/api/user/data`);
      console.log("User data response:", response.data, backEndUrl);
      response.data.success
        ? setUserData(response.data.userData)
        : toast.error(response.data.message);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const value = {
    backEndUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
