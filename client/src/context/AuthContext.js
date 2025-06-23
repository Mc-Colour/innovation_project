// src/context/AuthContext.js
import { createContext, useState } from "react";

// creates a global context object for authentication
export const AuthContext = createContext();

export function AuthProvider({ children }) {
    // initializes the token state from localStorage (if user was already logged in) 
    // or sets it to an empty string
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };
  // logs out the user by clearing the token state and removing it from localStorage
  // this will effectively log the user out and prevent access to protected routes
  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

    // provides the token and login/logout functions to all child components
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}