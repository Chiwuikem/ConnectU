import React, { useState } from "react";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import "../css/Booking.css";

const firebaseConfig = {
    apiKey: "AIzaSyBaNPzsPv3_U2oyC_DUdXqwax9nz1lurP8",
    authDomain: "serviceswitch-9a265.firebaseapp.com",
    projectId: "serviceswitch-9a265",
    storageBucket: "serviceswitch-9a265.appspot.com",
    messagingSenderId: "742555980154",
    appId: "1:742555980154:web:6c95fedc4a86e7c696c6c3",
    measurementId: "G-M9B2NWSSQQ",
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


function BookService({ providerId, onClose}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    serviceType: "",
    date: "",
    time: "",
    priceOffer: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "bookings"), {
        ...formData,
        providerId,
        status: "pending",
        createdAt: serverTimestamp(),
        
      });

      alert("Booking request submitted successfully!");
      // Optional: Clear form
      setFormData({
        name: "",
        email: "",
        serviceType: "",
        date: "",
        time: "",
        priceOffer: "",
      });
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("There was a problem submitting your booking.");
    }
  };

  return (
    <div className="booking-popup">
        <div className="popup-content">
            <button className="cancel-btn" onClick={onClose}>x</button>
            <h3>Book a Service</h3>
            <form onSubmit={handleSubmit}>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />

            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label>Service Type:</label>
            <input type="text" name="serviceType" value={formData.serviceType} onChange={handleChange} required />

            <label>Date:</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />

            <label>Time:</label>
            <input type="time" name="time" value={formData.time} onChange={handleChange} required />

            <label>Price Offer ($):</label>
            <input type="number" name="priceOffer" value={formData.priceOffer} onChange={handleChange} required />

            <button type="submit">Submit Booking</button>
            </form>
        </div>
    </div>
  );
}

export default BookService;
