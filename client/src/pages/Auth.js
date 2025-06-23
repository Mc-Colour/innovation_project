import React, { useState, useContext } from "react";
import axios from "axios"; // talking to our backend
import { AuthContext } from "../context/AuthContext"; // where token and login function are stored
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // for navigation after login/register

    // state to manage the mode (login or register) and form inputs
  const [mode, setMode] = useState("login"); // or register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // dont reload the page on form submit

    try {
      if (mode === "register") {
        await axios.post("http://localhost:3001/api/register", { email, password });
        alert("Registered! You can now log in.");
        setMode("login"); // switch to login mode after successful registration
      } else {
        const res = await axios.post("http://localhost:3001/api/login", { email, password });
        login(res.data.token);
        navigate("/horses"); // redirect to horses page after login
      }
    } catch (err) { // handle errors from the backend
      alert(mode === "register" ? "Registration failed" : "Login failed");
    }
  };

    // Render the form based on the mode (login or register)
  return (
    <div>
      <h2>{mode === "register" ? "Register" : "Login"}</h2> 
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">{mode === "register" ? "Register" : "Login"}</button>
      </form>

      <p>
        {mode === "register" ? "Already have an account?" : "Don't have an account?"}{" "}
        <button onClick={() => setMode(mode === "register" ? "login" : "register")}>
          {mode === "register" ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}