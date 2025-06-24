//CareReminers.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

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
        <div>
            <h2>Care Reminders</h2>
            <form onSubmit={handleSubmit}>
                <select name="horseId" value={form.horseId} onChange={handleChange} required>
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
                <button type="submit">Add Reminder</button>
            </form>
            <ul>
                {reminders.map((reminder) => (
                    <li key={reminder.ReminderID}>
                        {new Date(reminder.DueDate).toLocaleDateString()} - {reminder.Type}
                        <strong> - {reminder.HorseName}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
}