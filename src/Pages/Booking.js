import React, { useState } from "react";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import "../css/Booking.css";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,

  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID, 
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
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
