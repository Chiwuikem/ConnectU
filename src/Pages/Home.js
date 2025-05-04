import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import Login from "./Login";
import Signup from "./Signup";
import BookService from "./Booking";
import '../css/Home.css';



function Home() {
  const [providers, setProviders] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5); // Number of providers to show initially
  const [filters, setFilters] = useState({ zipcode: "", state: "", city: ""});
  const [filteredProviders, setFilterProviders] = useState([]);
  const [bookingProviderId, setBookingProviderId] = useState(null);
  const db = getFirestore();

  const fetchProviders = async () => {
    const querySnapshot = await getDocs(collection(db, "providers"));
    const providerData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setProviders(providerData);
    setFilterProviders(providerData); // Initialize filtered providers with all providers
  };
  useEffect(() => {
    fetchProviders();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 5); // Load 5 more providers each time
  }

  const handleFilterChange = (e) => {
    setFilters({...filters, [e.target.name]: e.target.value})
  };

  const applyFilters = () => {
    const {zipcode, state, city } = filters;
    const filtered = providers.filter(provider => {
      const matchesZip = zipcode ? (provider.zipCode && provider.zipCode.toString().includes(zipcode)) : true;
      const matchesState =  state ? (provider.state && provider.state.toLowerCase().includes(state.toLowerCase())) : true;
      const matchesCity = city ? (provider.city && provider.city.toLowerCase().includes(city.toLowerCase())) : true;
      return matchesZip && matchesState && matchesCity;

    });

    setFilterProviders(filtered);
    setVisibleCount(5); // Reset visible count when filters are applied

  };

  const clearFilters = () => {
    setFilters({ zipcode: "", state: "", city: "" });
    setFilterProviders(providers); // Reset to all providers
    setVisibleCount(5); // Reset visible count when filters are cleared
  };

  return (
    <>
    <div className="home-page">
      <nav className="navbar">
        <div className="logo">Service Switch</div>
        <div className="nav-links">
          <Login />
          <Signup />
          
        </div>
      </nav>

      <div className="top-center-text">
        <h1>Welcome to Service Switch</h1>
      </div>
      {/*filter Section*/}

      <div className="filter-section">
        <input
          type ="text"
          name="zipcode"
          placeholder="Zipcode"
          value={filters.zipcode}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={filters.state}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={filters.city}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <button onClick={applyFilters} className="filter-btn">Apply Filters</button>
        <button onClick={clearFilters} className="filter-btn clear-btn"> Clear Filter</button>
      </div>

      {/*Search Bar Section*/}
      <div className="search-bar-container">
            <input
            type="text"
            className="search-bar"
            placeholder="Search for services..."
            />
        </div>
      </div>
       {/* Displaying the list of providers */}
       <h2 style={{textAlign: "center", marginTop: "30px", color: "Black"}}>Browse Service Providers</h2>
        <div className="provider-list">
          {filteredProviders.slice(0, visibleCount).map(provider => (
            <div key={provider.id} className="provider-card">
              {provider.mainImage && (
                <div className="provider-main-img-container">
                  <img
                    src={provider.mainImage}
                    alt={`${provider.name}`}
                    className="provider-main-img"
                  />
                </div>
              )}
              <div className="provider-name">
                <h3>{provider.businessName || provider.name}</h3>
              </div>
              <button className="book-btn" onClick={() => setBookingProviderId(provider.id)}>
              Book
              </button>
            </div>
          ))}
        </div>

        {visibleCount < providers.length && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button onClick={handleLoadMore} className="load-more-btn">Load More</button>
          </div>
        )}
        {bookingProviderId && (
          <BookService
            providerId={bookingProviderId}
            onClose={() => setBookingProviderId(null)}
          />
        )}
    </>
  );
}

export default Home;