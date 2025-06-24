//get horses from backend
//shows horses in list
//allows adding a new horse
// when you add a horse it updates the list
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // import AuthContext to access user info
import { Link } from "react-router-dom"; // import Link to navigate to horse details
import React, {
    useState,
    useEffect,
    use
} from "react";
import axios from "axios";

// form input fields for adding a new horse
export default function Horses() {
    const [horses, setHorses] = useState([]);
    const [form, setForm] = useState({
        name: "",
        breed: "",
        age: "",
        weight: ""
    });

    const {token} = useContext(AuthContext); // get token from AuthContext

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
        try {
            await axios.post("http://localhost:3001/api/horses", {
                name: form.name,
                breed: form.breed,
                age: parseInt(form.age),
                weight: parseInt(form.weight)
            },
            {
                headers: {
                    Authorization: `Bearer ${token}` 
                } 
            }
            );
            // Fetch updated horse list after adding a new horse
            const res = await axios.get("http://localhost:3001/api/horses", {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });

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
    return (
        <div>
            <h2>My Horses</h2>
            {horses.length === 0 ? (
                <p>No horses found. Add your first horse!</p>
            ) : (
                <ul>
                    {horses.map((horse) => (
                        <li key={horse.HorseID}>
                            <Link to={`/horses/${horse.HorseID}`}>
                                {horse.Name} - {horse.Breed} ({horse.Age} years old)
                            </Link>
                        </li>
                    ))}
                </ul>
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
                <button type="submit">Add Horse</button>
            </form>
            )}
        </div>
    );
}