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
    const [careReminders, setReminders] = React.useState([]); // State to hold care reminders

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

    useEffect(() => {
        // Fetch care remindrs
        if (!selectedHorse || !token) return;
        axios.get(`http://localhost:3001/api/reminders`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => setReminders(res.data.slice(0, 3))) // Log the first 3 reminders for now
        .catch((err) => console.error("Error fetching care reminders:", err));
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
                        <Link to={`/horses`} className="view-link">View Horses</Link>
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

                    <div className="care-reminder-card">
                        <h2>Care Reminders</h2>
                        {careReminders.length > 0 ? (
                            <ul className="reminder-list">
                                {careReminders.map(r=> (
                                    <li key={r.ReminderID}>
                                        {r.Type} - Due: {new Date(r.DueDate).toLocaleDateString()} - {r.HorseName}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No care reminders set</p>
                        )}
                        <Link to={`/reminders`} className="view-link">View All</Link>
                    </div>

                    <div className="body-score-card">
                        <h2>Body Condition Scoring</h2>
                        <div className="bcs-bar">
                            
                            <div className="bcs-bars">
                                <div className="bcs-bar-segment red">1 Unhealthy (Thin)</div>
                                <div className="bcs-bar-segment yellow">2 Moderate (Lean)</div>
                                <div className="bcs-bar-segment green">3 Healthy (Good)</div>
                                <div className="bcs-bar-segment yellow">4 Unhealthy (Fat)</div>
                                <div className="bcs-bar-segment red">5 Very Unhealthy (Obese)</div>
                            </div>
                            <p className="bcs-score">2.5 - Healthy (Good)</p>
                        </div>
                    </div>

                    <div className="diet-exercise-card">
                        <h2>Diet</h2>
                        <div className="diet-box">
                            <p>3kg oats and barley mix<br /><small>9am</small></p>
                            <p>1kg Beet Pulp<br /><small>3pm</small></p>
                        </div>
                        <h2>Exercise</h2>
                        <div className="exercise-box">
                            <p>30 minute rdie<br /><small>10am</small></p>
                            <p>40 minute ride<br /><small>1pm</small></p>
                        </div>
                    </div>

                    <div className="education-card">
                        <h2>Education Zone</h2>
                        <div className="education-article-preview">
                            <h3>Understanding Equine Obesity</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                                Curabitur elementum massa risus, quis ultrices magna dictum vitae.
                            </p>
                        </div>

                        <Link to="/education" className="view-link">Read More</Link>
                    </div>
                        
                    
                </>
            ) : (
                <>
                    <p className="no-selection">Please select horse</p>
                    <Link to={`/horses`} className="view-link">View Horses</Link>
                </>
                
            )}
        </div>   
    );
}