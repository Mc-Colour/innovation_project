//CareReminers.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ReactComponent as HomeIcon } from '../img/Home.svg'; 
import { Link } from 'react-router-dom';

export default function CareReminders() {
    const { token } = useContext(AuthContext);
    const [reminders, setReminders] = useState([]);
    const [horses, setHorses] = useState([]);
    const [form, setForm] = useState({
        horseId: '',
        type: '',
        dueDate: ''
    });

    useEffect(() => {
        if (!token) return;
        // Fetch horses and reminders when the component mounts
        axios.get(`http://localhost:3001/api/horses`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => setHorses(res.data));
    


        axios.get(`http://localhost:3001/api/reminders`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => setReminders(res.data));
    }, [token]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page reload on form submit
        try {
            await axios.post(`http://localhost:3001/api/reminders`, form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updated = await axios.get(`http://localhost:3001/api/reminders`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setReminders(updated.data);
            setForm({ horseId: '', type: '', dueDate: '' }); // clear form after submission
        } catch (error) {
            console.error("Error adding care reminder:", error);
            alert("Failed to add care reminder");
        }
    };

    return (
        <div className="home-container">
            <div className="care-reminder-card">
                <h2>Care Reminders</h2>
                {reminders.length > 0 ? (
                    <ul className="reminder-list">
                        {reminders.map((r) => (
                            <li key={r.ReminderID}>
                                {r.Type} - Due: {new Date(r.DueDate).toLocaleDateString()} - {r.HorseName}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No care reminders found.</p>
                )}
            </div>

            <div className="horse-preview-card">
                <h2>Add Reminder</h2>
                <form onSubmit={handleSubmit} className="horse-form">
                    <select
                        name="horseId"
                        value={form.horseId}
                        onChange={handleChange}
                        required
                        className="horse-form-input"
                    >
                        <option value="">Select Horse</option>
                        {horses.map((horse) => (
                            <option key={horse.HorseID} value={horse.HorseID}>
                                {horse.Name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        placeholder="Reminder Type"
                        required
                    />
                    <input
                        type="date"
                        name="dueDate"
                        value={form.dueDate}
                        onChange={handleChange}
                        required
                    />
                    <div className="horse-form-buttons">
                        <button type="submit" className="view-link">Add Reminder</button>
                    </div>
                </form>
            </div>
            <Link to="/" className="home-button">
                <HomeIcon className="home-icon" />
            </Link>
        </div>
    );
}