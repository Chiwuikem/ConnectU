import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc} from "firebase/firestore";
import '../css/Login.css';

// Firebase config (same as you used before)
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
