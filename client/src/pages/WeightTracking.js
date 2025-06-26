//WeightTracking.js
import React, { useState, useEffect, useContext, use } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useSelectedHorse } from '../context/SelectedHorseContext'; // Import context to get selected horse
import { ReactComponent as HomeIcon } from '../img/Home.svg'; // Importing SVG icon
import { Link } from 'react-router-dom'; // Import Link to navigate back to home

export default function WeightTracking() {
    const { id } = useParams(); // get horse ID from URL
    const { token } = useContext(AuthContext); 
    const [weightEntries, setWeightEntries] = useState([]);
    const [newWeight, setNewWeight] = useState('');
    const { selectedHorse } = useSelectedHorse(); // get selected horse from context

    useEffect(() => {
        axios.get(`http://localhost:3001/api/horses/${id}/weights`, {
            headers: {
                Authorization: `Bearer ${token}` }
            })
            .then((res) => setWeightEntries(res.data))
            .catch((err) => console.error("Error fetching weight entries:", err));
    }, [id, token]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page reload on form submit
        try {
            await axios.post(`http://localhost:3001/api/horses/${id}/weights`, {
                weight: parseInt(newWeight)
            }, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            const updated = await axios.get(`http://localhost:3001/api/horses/${id}/weights`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setWeightEntries(updated.data);
            setNewWeight(''); // clear input field after submission
        }
        catch (error) {
            console.error("Error adding weight entry:", error);
            alert("Failed to add weight entry");
        }
    };
    return (
        <div className="home-container">
            <div className="weight-summary-card">
                <h2>Weight History - {selectedHorse ? selectedHorse.Name : "Horse"}</h2>
                {weightEntries.length > 0 ? (
                    <ul className="weight-list">
                        {weightEntries.map((entry) => (
                            <li key={entry.EntryID}>
                                {new Date(entry.EntryDate).toLocaleDateString(undefined , {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })} - {entry.Weight} kg
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No weight entries found for this horse.</p>
                )}
            </div>
            <div className="horse-preview-card">
                <h2>Log New Weight</h2>
                <form onSubmit={handleSubmit} className="horse-form">
                    <input
                        type="number"
                        placeholder="Enter weight in kg"
                        value={newWeight}
                        onChange={(e) => setNewWeight(e.target.value)}
                        required
                    />
                    <div classNmae="horse-form-buttons">
                        <button type="submit" className="view-link">Log Weight</button>
                    </div>
                </form>
            </div>
            <Link to="/" className="home-button">
                <HomeIcon className="home-icon" />
            </Link>
        </div>
    );
}
        