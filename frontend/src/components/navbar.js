import React, { useEffect, useState } from 'react'; 
import './navbar.css'; // Ensure to import your CSS file for custom styles

const Navbar = ({ searchInput, setSearchInput }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false); // State to track input focus

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setIsScrolled(currentScrollY > 0); // Set to true if scrolled down
  };

  useEffect(() => {
    // Preload images
    const preloadImages = () => {
      const img1 = new Image();
      const img2 = new Image();
      img1.src = "https://react.the2px.com/wp-content/uploads/2024/10/search-svgrepo-com.svg";
      img2.src = "https://react.the2px.com/wp-content/uploads/2024/10/right-arrow-svgrepo-com.svg";
    };

    preloadImages();
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
          <img src="https://react.the2px.com/wp-content/uploads/2024/10/the2px-logo.svg" alt="the2px logo" className="navbar-logo" />
        </div>

        <div className="r-div d-flex align-items-center">
          <div className="search-bar mx-3">
            <input
              type="text"
              placeholder="Search by tags..."
              className="form-control"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setIsInputFocused(true)} // Set input focus state to true
              onBlur={() => setIsInputFocused(false)} // Reset input focus state
            />
            <div className='s-icn'>
              <span className="search-icon">
                {/* Conditionally render icons based on input focus */}
                {isInputFocused ? (
                  <img src="https://react.the2px.com/wp-content/uploads/2024/10/right-arrow-svgrepo-com.svg" alt="Arrow Icon" width="20" height="20" className="inverted-arrow yellow-icon" />
                ) : (
                  <img src="https://react.the2px.com/wp-content/uploads/2024/10/search-svgrepo-com.svg" alt="Search Icon" width="20" height="20" className="yellow-icon" />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
