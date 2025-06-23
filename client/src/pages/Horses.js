// get horses from backend
// shows horses in a list
// allows adding a new horse
// when you add a horse it updates the list

import React, { useEffect, useState } from "react"; // runs when the page loads
import axios from "axios";

// form input fields for adding a horse
export default function Horses() {
  const [horses, setHorses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    breed: "",
    age: "",
    weight: ""
  });

  // Fetch horses from backend on load
  useEffect(() => {
    axios.get("http://localhost:3001/api/horses")
      .then(res => setHorses(res.data))
      .catch(err => console.error("Error loading horses:", err));
  }, []);

    // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    // Handle form submission to add a new horse
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload on form submit
    try {
        // Post new horse data to the backend
      await axios.post("http://localhost:3001/api/horses", {
        name: form.name,
        breed: form.breed,
        age: parseInt(form.age),
        weight: parseInt(form.weight),
        userId: 1 // temporary hardcoded user
      });
        // Fetch updated horse list after adding a new horse
      const res = await axios.get("http://localhost:3001/api/horses");
      setHorses(res.data);
        // Reset form fields
      setForm({ name: "", breed: "", age: "", weight: "" });
    } catch (err) {
      console.error("Failed to add horse:", err); // log error if adding horse fails
    }
  };

  return (
    <div>
      <h2>My Horses</h2>
      {horses.length === 0 ? (
        <p>No horses found.</p>
      ) : (
        <ul>
          {horses.map(horse => (
            <li key={horse.HorseID}>
              {horse.Name} – {horse.Breed}, {horse.Age} yrs
            </li>
          ))}
        </ul>
      )}

      <h3>Add a Horse</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input type="text" name="breed" placeholder="Breed" value={form.breed} onChange={handleChange} />
        <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} />
        <input type="number" name="weight" placeholder="Weight (kg)" value={form.weight} onChange={handleChange} />
        <button type="submit">Add Horse</button>
      </form>
    </div>
  );
}