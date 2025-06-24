import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function HorseDetail() {
    const { id } = useParams(); // get horse ID from URL
    const {token} = useContext(AuthContext); // get token from AuthContext
    const [horse, setHorse] = useState(null); 

    useEffect(() => {
        axios.get(`http://localhost:3001/api/horses/${id}`, {
            headers: {
                Authorization: `Bearer ${token}` // include token in request headers
            }
        })
            .then(res => setHorse(res.data))
            .catch(err => console.error("Error fetching horse details:", err));
    }, [id, token]);

    if (!horse) return <p>Loading...</p>;

    return (
        <div>
            <h2>{horse.Name}</h2>
            <p><strong>Breed:</strong> {horse.Breed}</p>
            <p><strong>Age:</strong> {horse.Age} years</p>
            <p><strong>Weight:</strong> {horse.CurrentWeight} kg</p>
        </div>
    );
}
    