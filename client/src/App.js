import React, {useContext} from "react"
import { BrowserRouter as Router, Routes, Route, Link, useNavigate} from "react-router-dom"
import Horses from "./pages/Horses";
import Auth from "./pages/Auth";
import { AuthContext } from "./context/AuthContext";
import HorseDetail from "./pages/HorseDetail";
import WeightTracking from "./pages/WeightTracking";
import Education from "./pages/Education";
import CareReminders from "./pages/CareReminders";
import "./styles/App.css";
import Header from "./components/Header";
import Home from "./pages/Home";

function App() {
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // handle logout when booton is pressed
    const handleLogout = () => {
        logout();
        navigate("/auth"); // redirect to auth page after logout
    };
    return (
        <>
            <Header onLogout={handleLogout} isAuthenticated={!!token} /> 
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/horses" element={<Horses />} />
                <Route path="/horses/:id" element={<HorseDetail />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/horses/:id/weight" element={<WeightTracking />} />
                <Route path="/education" element={<Education />} />
                <Route path="/reminders" element={<CareReminders />} />
            </Routes>
        </>
    );
}
export default App;