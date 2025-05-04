import React, {useEffect, useRef, useState} from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase"; // Adjust the import based on your firebase configuration file
import "../css/ConfirmedBookingsProfile.css";

function ConfirmedBookingsProfile ({ providerId, refreshTrigger}){
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [confirmedBookings, setConfirmedBookings] = useState([]);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchConfirmedBookings = async () => {
            try {
                const snapshot = await getDocs(collection(db, "confirmed_bookings"));
                const bookings = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(b => b.providerId === providerId);
                setConfirmedBookings(bookings);
            } catch (error) {
                console.error("Error fetching confirmed bookings:", error);
            }
        };
        fetchConfirmedBookings();
    }, [providerId, refreshTrigger]);

    useEffect (() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && ! dropdownRef.current.contains(event.target)){
                setDropdownOpen(false);
            }
        };
        if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    const cancelBooking = async (bookingId) => {
        try{
            await deleteDoc(doc(db, "confirmed_bookings", bookingId));
            setConfirmedBookings((prev) => 
            prev.filter((booking) => booking.id !== bookingId)
            );
            alert("Booking canceled susccesfully!"); 
        } catch (error) {
            console.error("Error canceling booking:", error);
            alert("There was a problem canceling your booking.");
        }
    };

    return (
        <aside className="sidebar" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="dropdown-toggle">
                {dropdownOpen ? "Hide Confirmed Bookings" : "Show Confirmed Bookings"}
            </button>

            <div className={`confirmed-bookings-dropdown ${dropdownOpen ? 'open' : ''}`}>
                {confirmedBookings.length === 0 ? (
                    <p className="empty-message">No confirmed bookings at the moment.</p>
                ) : (
                    confirmedBookings.map((booking) => (
                        <div key={booking.id} className="confirmed-booking-card">
                            <p><strong>Service:</strong> {booking.serviceType}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <p><strong>Status:</strong> {booking.status}</p>
                            <button onClick={() => cancelBooking(booking.id)} className="cancel-button">
                                Cancel Booking
                            </button>
                        </div>
                    ))
                )}
            </div>
        </aside>
    );
}

export default ConfirmedBookingsProfile;