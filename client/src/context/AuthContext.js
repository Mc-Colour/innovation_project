import { createContext, useState } from "react";
// creates a global context obj for authentication
export const AuthContext = createContext();

export function AuthProvider({ children }) {
    // initialises the token state from local storage if user is already logged in
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem("token", newToken); // store token in local storage
    };

    // logs out the user by clearing the token state and removing it from local storage
    const logout = () => {
        setToken("");
        localStorage.removeItem("token");
    };

    // provides the token and login/logout functions to children components
    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}