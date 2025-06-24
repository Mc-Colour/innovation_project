import React, { useState, useContext } from "react";
import axios from "axios"; // talking to the backend
import { AuthContext } from "../context/AuthContext"; // where token and login function are stored
import { useNavigate } from "react-router-dom"; // for redirecting after login/register

export default function Auth() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // state to manage the mode (login or regester) and form inputs
    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault(); // dont reload on form submit
        try {
            if (mode === "register") {
                await axios.post("http://localhost:3001/api/register", {
                    email,
                    password,
                });
                alert("Registration complete. You can now log in.");
                setMode("login"); // switch to login mode after registration
            } else {
                const response = await axios.post("http://localhost:3001/api/login", {
                    email,
                    password,
                });
                login(response.data.token); // call login function from context with the token
                navigate("/horses"); // redirect to horses page after successful login
            }
        } catch (error) {
            alert(mode === "register" ? "Registration failed" : "Login failed");
        }
    };
    return (
        <div>
            <h2>{mode === "register" ? "Register" : "Login"}</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" required />
                <button type="submit">{mode === "register" ? "Register" : "Login"}</button>
            </form>
            <p>
                {mode === "register" ? "Already have an account? " : "Don't have an account?"}{""}
                <button onClick={() => setMode(mode === "register" ? "login" : "register")}>
                    {mode === "register" ? "Login here" : "Register here"}
                </button>
            </p>
        </div>
    );
}
