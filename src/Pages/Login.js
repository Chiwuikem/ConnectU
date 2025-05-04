import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc} from "firebase/firestore";
import '../css/Login.css';

// Firebase config (same as you used before)
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
const auth = getAuth(app);

function Login() {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const UserCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = UserCredential.user;

        
        let data = null;
        let displayName = user.email;

        let userDocRef = doc(db,"users",user.uid);
        let userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
            userDocRef = doc(db,"providers",user.uid);
            userDoc = await getDoc(userDocRef);
        }

        if (userDoc.exists()) {
            data = userDoc.data();
            if (data.role === "provider" && data.businessName) {
                displayName = data.businessName;
            } else if (data.username) {
                displayName = data.username;
            }
        }
        const role = data ? data.role : "users";


        sessionStorage.setItem("loggedInUser", JSON.stringify({
            uid: user.uid, 
            name: displayName, 
            role: role }));

        console.log("User data: ", data);
        console.log("Role: ", role);
        console.log("Display Name: ", displayName);

        alert(`Why you broke, ${displayName}!`);
        window.location.href = "/profile";
     } catch (error) {
        console.error("Login failed: ", error.message);
        alert("Error: " + error.message);
     }

     setShowPopup(false);

    };

  return (
    <>
      <button className="login-btn" onClick={togglePopup}>Log In</button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <span className="close-btn" onClick={togglePopup}>&times;</span>
            <h2>Log In</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              /><br />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              /><br />
              <button type="submit">Log In</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
