import { createContext, useContext } from "react";
import { useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

// We wrapped our whole app in this (Parent component)
export const AuthContextProvider = ({ children }) => {
  // Parses the localstorage info we saved in useSignup back into a JS object
  // this is known as a hook since its a variable that will be changing states
  // authUser is the variable and setAuthUser is the function that useState will use to set the variable to what we want
  // Sets the authUser variable to the json object we parsed
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("chat-user") || null)
  );
  return (
    // .Provider gives us the ability to variables and their states globally
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {/* the '{children}' is inside the body tags of AuthContext.Provider so it basically 
        means we are giving authUser and setAuthUser to the children components */}
      {children}
    </AuthContext.Provider>
  );
};
