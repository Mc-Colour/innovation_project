//Homepage
import React, { useContext, useEffect } from "react";
import { useSelectedHorse } from "../context/SelectedHorseContext";
import { Link } from "react-router-dom";
import "../styles/App.css";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext for authentication

export default function Home() {
    const { selectedHorse } = useSelectedHorse();
    const [weights, setWeights] = React.useState([]); // State to hold weight data
    const {token} = useContext(AuthContext); // Get token from AuthContext

    useEffect(() => {
        // Fetch weight data for the selected horse
        if (!selectedHorse || !token) return;
        axios.get(`http://localhost:3001/api/horses/${selectedHorse.HorseID}/weights`, {
            headers: {
                Authorization: `Bearer ${token}` // Include token in request headers
            }
        })
        .then(res => setWeights(res.data.slice(0, 5)))
        .catch((err) => console.error("Error fetching weight data:", err));
    }, [selectedHorse, token]);
    

    
    return (
        
        <div className="home-container">
            <h1 className="home-title">Welcome to Equiwelf</h1>
            {selectedHorse ? (
                <>
                    <div className="horse-preview-card">
                        <h2>{selectedHorse.Name}</h2>
                        <p><strong>Breed:</strong> {selectedHorse.Breed || "N/A"}</p>
                        <p><strong>Age:</strong> {selectedHorse.Age} years </p>
                        <p><strong>Weight:</strong> {selectedHorse.CurrentWeight} kg</p>
                        <Link to={`/horses/${selectedHorse.HorseID}`} className="view-link">View Horse</Link>
                    </div>

                    <div className="weight-summary-card">
                        <h2>Weight History</h2>
                        {weights.length > 0 ? (
                            <ul className="weight-list">
                                {weights.map(entry => (
                                    <li key={entry.EntryID}>
                                        {new Date(entry.EntryDate).toLocaleDateString()} - {entry.Weight} kg
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No weight entries yet</p>
                        )}
                        <Link to={`/horses/${selectedHorse.HorseID}/weight`} className="view-link">Log Weight</Link>
                    </div>
                </>
            ) : (
                <p className="no-selection">Please select horse</p>
            )}
        </div>   
    );
}