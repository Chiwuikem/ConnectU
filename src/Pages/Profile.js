import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../css/Profile.css";
import ProviderGallery from "./ProviderGallery";
import { uploadProviderImage } from "./Upload"; 
import ProviderBooking from "./ProviderBooking";
import ConfirmedBookingsProfile from "./ConfirmedBookingsProfile";

function Profile() {
  const [userName, setUserName] = useState(null);
  const [role, setRole] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [refreshGallery, setRefreshGallery] = useState(false);
  
  const db = getFirestore();
  const navigate = useNavigate();

 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        const db = getFirestore();
        const providerDoc = await getDoc(doc(db, "providers", user.uid));

        const providerData = providerDoc.exists() ? providerDoc.data() : {};
        const userName = providerData.username || providerData.name || "Provider";
        setUserName(userName);
        setRole("provider");

        sessionStorage.setItem(
          "loggedInUser",
          JSON.stringify({
            name: user.displayName || "Provider",
            uid: user.uid,
            role: "provider",
          })
        );
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);


  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    sessionStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const description = prompt("Enter a description for the image:");
    

    try {
      setUploading(true);
      const imageUrl = await uploadProviderImage(file);
      const user = getAuth().currentUser;
  
      const providerRef = doc(db, "providers", user.uid);
      const providerSnap = await getDoc(providerRef);
  
      let updates = {
        gallery: arrayUnion({ url: imageUrl, description: description || "" })
      };
  
      if (!providerSnap.exists() || !providerSnap.data().mainImage) {
        // If this provider has no mainImage yet, set it
        updates.mainImage = imageUrl;
      }
  
      await updateDoc(providerRef, updates);
  
      alert("Image uploaded successfully!");
      setRefreshGallery(prev => !prev); // Trigger a refresh of the gallery
    } catch (error) {
      console.error("Image upload failed: ", error);
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const storedUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  const providerId = storedUser?.uid;

  return (
    <div className="profile-page">
      <ConfirmedBookingsProfile providerId={providerId} refreshTrigger={refreshGallery}/>


      <h2>User Profile</h2>
      <p>Whats good {userName}!</p>
      <button onClick={handleLogout}>Logout</button>

      {role === "provider" && (
        <div className="provider-gallery-section">
            <h3>Your Service Gallery</h3>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                />
            {uploading && (
             <div className="spinner-container">
                <div className="spinner"></div>
                <p>Uploading...</p>
             </div>
            )}
            <ProviderGallery refresh={refreshGallery} />
            <ProviderBooking providerId={providerId} />
        </div>
      )}
    </div>
  );
}

export default Profile;















