//WeightTracking.js
import React, { useState, useEffect, useContext, use } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function WeightTracking() {
    const { id } = useParams(); // get horse ID from URL
    const { token } = useContext(AuthContext); 
    const [weightEntries, setWeightEntries] = useState([]);
    const [newWeight, setNewWeight] = useState('');

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
        <div>
            <h2>Weight History</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="number" 
                    value={newWeight} 
                    onChange={(e) => setNewWeight(e.target.value)} 
                    placeholder="Enter weight in kg" 
                    required 
                />
                <button type="submit">Log Weight</button>
            </form>
            <ul>
                {weightEntries.map((entry) => (
                    <li key={entry.EntryID}>
                        {new Date(entry.EntryDate).toLocaleDateString(undefined, {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })} - {entry.Weight} kg
                    </li>
                ))}
            </ul>
        </div>
    );
}
        