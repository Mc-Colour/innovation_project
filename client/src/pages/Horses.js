//get horses from backend
//shows horses in list
//allows adding a new horse
// when you add a horse it updates the list
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // import AuthContext to access user info
import { Link } from "react-router-dom"; // import Link to navigate to horse details
import { SelectedHorseContext } from "../context/SelectedHorseContext"; // import SelectedHorseContext to manage selected horse state
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
        <div>
            <h2>My Horses</h2>
            {horses.length === 0 ? (
                <p>No horses found. Add your first horse!</p>
            ) : (
                <>
                <>{selectedHorse && <p>Currently selected: {selectedHorse.Name}</p>}
                <ul>
                    {horses.map((horse) => (
                        <li key={horse.HorseID}>
                            <Link to={`/horses/${horse.HorseID}`}>
                                {horse.Name} - {horse.Breed} ({horse.Age} years old)
                            </Link>
                            <button onClick={() => setSelectedHorse(horse)}>Select</button>
                            {token && (
                                <>
                                    <button onClick={() => {
                                        setForm({
                                            name: horse.Name,
                                            breed: horse.Breed,
                                            age: horse.Age,
                                            weight: horse.CurrentWeight
                                        });
                                        setEditingID(horse.HorseID); // set the ID of the horse being edited
                                    }}>
                                        Edit
                                    </button>
                                    <button onClick={() => { handleDelete(horse.HorseID); }}>Delete</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
                </>
                </>
            )}
            <h3>Add a New Horse</h3> 
            {!token ? (
                <p>Please log in to add horses.</p>
            ) : (
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
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
                    placeholder="Age"
                    value={form.age}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="weight"
                    placeholder="Weight"
                    value={form.weight}
                    onChange={handleChange}
                />
                <button type="submit">{editingID? "Edit Horse" : "Add Horse"}</button>
            </form>
            )}
        </div>
    );
}