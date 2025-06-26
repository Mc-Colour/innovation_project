//get horses from backend
//shows horses in list
//allows adding a new horse
// when you add a horse it updates the list
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // import AuthContext to access user info
import { Link } from "react-router-dom"; // import Link to navigate to horse details
import { SelectedHorseContext } from "../context/SelectedHorseContext"; // import SelectedHorseContext to manage selected horse state
import { ReactComponent as HomeIcon } from '../img/Home.svg'; // Importing SVG icon

import React, {
    useState,
    useEffect,
    use
} from "react";
import axios from "axios";

// form input fields for adding a new horse
export default function Horses() {
    const { setSelectedHorse } = useContext(SelectedHorseContext); // get function to set selected horse
    const {selectedHorse} = useContext(SelectedHorseContext); // get currently selected horse
    const [horses, setHorses] = useState([]);
    const [form, setForm] = useState({
        name: "",
        breed: "",
        age: "",
        weight: ""
    });

    const {token} = useContext(AuthContext); // get token from AuthContext
    const [editingID, setEditingID] = useState(null); // state to track which horse is being edited

    // Fetch horses from backend on load
    useEffect(() => {
        axios.get("http://localhost:3001/api/horses", {
            headers: {
                Authorization: `Bearer ${token}` // include token in request headers
            }
        })
            .then(res => setHorses(res.data))
            .catch(err => console.error("Error fetching horses:", err));
    }, [token]);

    // Handle form input changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle form submission to add a new horse
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page reload on form submit
        
        const payload = {
            name: form.name,
            breed: form.breed,
            age: parseInt(form.age),
            weight: parseInt(form.weight)
        };
        const config = {
            headers: {
                Authorization: `Bearer ${token}` // include token in request headers
            }
        }
        try {
            if (editingID) {
                await axios.put(`http://localhost:3001/api/horses/${editingID}`, payload, config);
            } else {
                await axios.post("http://localhost:3001/api/horses", payload, config);
            }
            
            const res = await axios.get("http://localhost:3001/api/horses", config);

            setHorses(res.data);
            // Reset form fields
            setForm({
                name: "",
                breed: "",
                age: "",
                weight: ""
            });
        } catch (error) {
            console.error("Error adding horse:", error);
        }
    };
    // Handle deleting a horse
    const handleDelete = async (id) => {
        try {
            // delete horse by ID
            await axios.delete(`http://localhost:3001/api/horses/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            // After deletion, fetch the updated list of horses
            const res = await axios.get("http://localhost:3001/api/horses", {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            setHorses(res.data); // update horses list after deletion
        } catch (error) {
            console.error("Error deleting horse:", error);
        }
    };
    return (
        <div className="home-container">
            <h1 className="home-title">Manage Your Horses</h1>
            {horses.map(horse=> (
                <div key={horse.HorseID} className="horse-preview-card">
                    <h2>{horse.Name}</h2>
                    <p><strong>Breed:</strong> {horse.Breed || "N/A"}</p>
                    <p><strong>Age:</strong> {horse.Age} years</p>
                    <p><strong>Weight:</strong> {horse.CurrentWeight} kg</p>
                    <div className="horse-card-buttons">
                        <button 
                        className="view-link"
                        disabled={selectedHorse?.HorseID === horse.HorseID} // disable if already selected
                        onClick={() => setSelectedHorse(horse)}
                    >
                        {selectedHorse?.HorseID === horse.HorseID ? "Selected" : "Select"}
                    </button>

                        <button className="view-link" onClick={() => {
                            setForm({
                                name: horse.Name,
                                breed: horse.Breed,
                                age: horse.Age,
                                weight: horse.CurrentWeight
                            });
                            setEditingID(horse.HorseID); // set ID for editing
                        }}>Edit</button>
                        <button className="view-link" onClick={() => handleDelete(horse.HorseID)}>Delete</button>
                    </div>
                </div>
            ))}

            <div className="horse-preview-card">
                <h2>{editingID? "Edit Horse" : "Add a New Horse"}</h2>
                <form onSubmit={handleSubmit} className="horse-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="Horse Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="breed"
                        placeholder="Breed"
                        value={form.breed}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="age"
                        placeholder="Age (years)"
                        value={form.age}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="weight"
                        placeholder="Weight (kg)"
                        value={form.weight}
                        onChange={handleChange}
                    />
                    <div className="horse-form-buttons">
                        <button type="submit" className="view-link">
                            {editingID ? "Save" : "Add Horse"}
                        </button>
                        <button
                            type="submit"
                            className="view-link"
                            onClick={() => {
                                setForm({ name: "", breed: "", age: "", weight: "" });
                                setEditingID(null); // reset editing ID
                            }}>cancel
                        </button>
                        
                    </div>
                </form>
            </div>
            <Link to="/" className="home-button">
                <HomeIcon className="home-icon" />
            </Link>
            
        </div>
    );
}