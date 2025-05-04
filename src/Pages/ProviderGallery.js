import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "../css/ProviderGallery.css";

function ProviderGallery({ refreshGallery }) {
  const [gallery, setGallery] = useState([]);
  const db = getFirestore();

  const fetchGallery = async () => {
    const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (user && user.uid) {
      const providerRef = doc(db, "providers", user.uid);
      const providerDoc = await getDoc(providerRef);

      if (providerDoc.exists()) {
        setGallery(providerDoc.data().gallery || []);
      }
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [refreshGallery]); // Refresh when the refreshGallery prop changes

  return (
    <div className="gallery-container">
      {gallery.map((item, index) => (
        <div key={index} className="gallery-item">
          <div className="image-display">
            <img src={item.url} alt={`Provider Image ${index + 1}`} />
          </div>
          <div className="description-display">
            <p>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProviderGallery;
