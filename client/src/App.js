import React, {useContext} from "react"
import { BrowserRouter as Router, Routes, Route, Link, useNavigate} from "react-router-dom"
import Horses from "./pages/Horses";
import Auth from "./pages/Auth";
import { AuthContext } from "./context/AuthContext";
import HorseDetail from "./pages/HorseDetail";

function Home() {
    return <h1>Welcome to Equiwelf</h1>;
}

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
            <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc"}}>
                <Link to="/">Home</Link> | <Link to="/horses">My Horses</Link> |
                {!token ? (
                    <Link to ="/auth">Login</Link>
                ): (
                    <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>
                        Logout
                    </button>
                )}
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/horses" element={<Horses />} />
                <Route path="/horses/:id" element={<HorseDetail />} />
                <Route path="/auth" element={<Auth />} />
            </Routes>
        </>
    );
}
export default App;