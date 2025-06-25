//Homepage
import React from "react";
import { useSelectedHorse } from "../context/SelectedHorseContext";
import { Link } from "react-router-dom";
import "../styles/App.css";

export default function Home() {
    const { selectedHorse } = useSelectedHorse();
    
    return (
        <div className="home-container">
            <h1 className="home-title">Welcome to Equiwelf</h1>
            {selectedHorse ? (
                <div className="horse-preview-card">
                    <h2>{selectedHorse.Name}</h2>
                    <p><strong>Breed:</strong> {selectedHorse.Breed || "N/A"}</p>
                    <p><strong>Age:</strong> {selectedHorse.Age} years </p>
                    <p><strong>Weight:</strong> {selectedHorse.CurrentWeight} kg</p>
                    <Link to={`/horses/${selectedHorse.HorseID}`} className="view-link">View Horse</Link>
                </div>
            ) : (
                <p className="no-selection">No horse selected.</p>
            )}
        </div>
    )
}