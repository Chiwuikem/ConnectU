import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import "../css/ProviderBooking.css";

function ProviderBooking({providerId}) {
    const [bookings, setBookings] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const bookingsRef = collection(db, "bookings");
                const q = query(bookingsRef, where ("providerId", "==", providerId));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({id: doc.id, ...doc.data() }));
                setBookings(data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };
        fetchBookings();
    }, [providerId, db]);

    const handleAccept = async (booking) => {
        try {
            const bookingId = booking.id;
            const bookingData = {...booking};
            delete bookingData.id; // Remove the id field before adding to confirmed bookings
            await addDoc(collection(db, "confirmed_bookings"), {
                ...bookingData,
                status: "confirmed",
                createdAt: serverTimestamp(),
            });
            await deleteDoc(doc(db, "bookings", booking.id));
            setBookings(bookings.filter(b => b.id !== bookingId));
        } catch (error) {
            console.error("Error accepting booking:", error);
        }
    };

    const handleReject = async (bookingId) => {
        try {
            await deleteDoc(doc(db, "bookings", bookingId));
            setBookings(bookings.filter(b=> b.id !== bookingId));
        } catch (error) {
            console.error("Error rejecting booking:", error);
        }
    };

    return (
        <div className="booking-list">
            <h3> Pending Booking Requests</h3>
            {bookings.length === 0 ? (
                <p>No bookings at the moment.</p>
            ) : ( 
                bookings.map((booking) => (
                    <div key={booking.id} className="booking-card">
                        <div className="booking-info"><p><strong>Service:</strong>{booking.serviceType}</p></div>
                        <div className="booking-info"><p><strong>Date:</strong>{booking.date}</p></div>
                        <div className="booking-info"><p><strong>Time:</strong>{booking.time}</p></div>
                        <div className="booking-info"><p><strong>Price Offer:</strong>{booking.priceOffer}</p></div>
                        <div className="booking-actions">
                            <button className="accept-btn" onClick={() => handleAccept(booking)}>Accept</button>
                            <button className="reject-btn" onClick={() => handleReject(booking.id)}>Reject</button>
                        </div>   
                    </div>
                ))
            )}
        </div>
    );
}

export default ProviderBooking;