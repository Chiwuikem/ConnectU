import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import '../css/Signup.css';

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
const auth = getAuth(app);
const db = getFirestore(app);

function Signup(){ 
    const [showPopup, setShowPopup] = useState(false);
    const [role, setRole] = useState(""); // Default role is "user"
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        confirm_email: "",
        password: "",
        confirm_password: "",
        businessName: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        bio: "",

    });


    const togglePopup = () => {
        if (showPopup) {
          // Closing popup, so reset everything
          setRole("");
          setFormData({
            name: "",
            username: "",
            email: "",
            confirm_email: "",
            password: "",
            confirm_password: "",
            businessName: "",
            streetAddress: "",
            city: "",
            state: "",
            zipCode: "",
            phoneNumber: "",
            bio: "",
          });
        }
        setShowPopup(!showPopup);
      };
    const handleChange = (e) => {
        setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleRoleSelection = (selectedRole) => {
        setRole(selectedRole);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const {name, username, email, confirm_email, password, confirm_password, businessName, streetAddress, city, state, zipCode, phoneNumber,  bio} = formData;

        const [firstName, ...rest] = name.trim().split(" ");
        const lastName = rest.join(" ") || "";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        
        // if (!emailRegex.test(userEmail)) {
        //     console.log("Invalid email");
        // }
        
        // if (!passwordRegex.test(userPassword)) {
        //     console.log("Invalid password");
        // }
        if (email !== confirm_email) {
            alert("Emails do not match");
            return;
        }

        if (password !== confirm_password) {
            alert("Passwords do not match");
            return;
        }
        // if (password.length < 8) {
        //     alert("Password must be at least 8 characters long");
        //     return;
        // }
        // if (!/\d/.test(password)) {
        //     alert("Password must contain at least one number");
        //     return;
        // }
        // if (!/[a-zA-Z]/.test(password)) {
        //     alert("Password must contain at least one letter");
        //     return;
        // }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (role === "provider") {
                await setDoc(doc(db, "providers", user.uid), {
                    uid: user.uid,
                    role: "provider",
                    firstName,
                    lastName,
                    username,
                    email,
                    businessName,
                    streetAddress,
                    city,
                    state,
                    zipCode,
                    phoneNumber,
                    bio,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            } else {
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    role: "user",
                    firstName,
                    lastName,
                    username,
                    email,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }
            sessionStorage.setItem(
                "userProfile", 
                JSON.stringify({uid: user.uid, role, firstName, lastName, username, email})
            );

            alert("Account created successfully! Please log in.");
            window.location.href = "/";
            } catch (error) {
                console.error("Error creating account: ", error);
                alert("Error:" + error.message);
            }

            setShowPopup(false);
    };

    return (
        <>
            <button className="signup-btn" onClick={togglePopup}>Sign Up</button>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <span className="close-btn" onClick={togglePopup}>&times;</span>

                        {!role ? (
                            <>
                                <h2>Are you a Provider or a User</h2>
                                <div className="role-buttons">
                                    <button onClick={() => handleRoleSelection("user")}>User</button>
                                    <button onClick={() => handleRoleSelection("provider")}>Provider</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2>Sign Up as {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
                                <form onSubmit={handleSubmit}>

                                    <label>Name:</label><br />
                                    <input type ="text" name="name" placeholder="Name" onChange={handleChange} required />

                                    <label>Username:</label><br />
                                    <input type="username" name="username" onChange={handleChange} required />

                                    <label>Email:</label><br />
                                    <input type="text" name="email" onChange={handleChange} required />
                                    <label>Confirm Email:</label><br />
                                    <input type="text" name="confirm_email" onChange={handleChange} required />

                                    <label>Password:</label><br />
                                    <input type="password" name="password" onChange={handleChange} required />
                                    <label>Confirm Password:</label><br />
                                    <input type="password" name="confirm_password" onChange={handleChange} required />

                                    {role === "provider" && (
                                        <>
                                        <label>Business Name:</label><br />
                                        <input type="text" name="businessName" placeholder="Business Name" onChange={handleChange} required />

                                        <label>Street Address:</label><br />
                                        <input type="text" name="streetAddress" placeholder="Street Address" onChange={handleChange} required />

                                        <label>City:</label><br />
                                        <input type="text" name="city" placeholder="City" onChange={handleChange} required />

                                        <label>State:</label><br />
                                        <input type="text" name="state" placeholder="State" onChange={handleChange} required />

                                        <label>Zip Code:</label><br />
                                        <input type="text" name="zipCode" placeholder="Zip Code" onChange={handleChange} required />

                                        <label>Phone Number:</label><br />
                                        <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />

                                        <label>Bio:</label><br />
                                        <textarea name="bio" placeholder="Tell us about your services..." onChange={handleChange}></textarea>
                                        </>
                                    )}

                                    <button type="submit">Register</button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}       
        </>
        
    );
}
export default Signup;