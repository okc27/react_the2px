import React, { useEffect, useState } from 'react';
import './navbar.css'; // Ensure to import your CSS file for custom styles

const Navbar = ({ searchInput, setSearchInput }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setIsScrolled(currentScrollY > 0); // Set to true if scrolled down
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll); // Clean up the event listener
    };
  }, []);

  return (
    <nav className={`navbar navbar-light ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container-fluid" id="org-nav">
        <div className="navbar-brand" onClick={() => console.log('Brand clicked!')}>
          {/* Update the logo URL */}
          <img src="http://localhost/headlesswp/the2px/wp-content/uploads/2024/10/the2px-logo.svg" alt="the2px logo" className="navbar-logo" />
        </div>

        <div className="r-div d-flex align-items-center">
          <div className="search-bar mx-3">
            <input
              type="text"
              placeholder="Search by tags..."
              className="form-control"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <span className="search-icon">
              {/* Update the search icon URL */}
              <img src="http://localhost/headlesswp/the2px/wp-content/uploads/2024/10/search-svgrepo-com.svg" alt="Search Icon" width="20" height="20" />
            </span>
          </div>
          
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
