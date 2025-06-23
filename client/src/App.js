import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Horses from "./pages/Horses";
import Auth from "./pages/Auth";

function Home() {
  return <h1>Welcome to Equiwelf</h1>;
}

function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link to="/">Home</Link> | <Link to="/horses">My Horses</Link> | <Link to="/auth">Login/Register</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/horses" element={<Horses />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;