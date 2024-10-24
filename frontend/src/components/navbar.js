import React, { useEffect, useState } from 'react';
import './navbar.css'; // Ensure to import your CSS file for custom styles

const Navbar = ({ svgColor, setSvgColor, bgColor, setBgColor, searchInput, setSearchInput }) => {
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
          
          <div className="color-picker d-flex align-items-center">
            <div className="pk1 d-flex align-items-center">
              <label htmlFor="svg-color-picker" className="me-2">Img Color</label>
              <span className="drop-icon">
                {/* Update the dropdown icon URL */}
                <img src="http://localhost/headlesswp/the2px/wp-content/uploads/2024/10/dropdown-svgrepo-com.svg" alt="Drop Icon" width="20" height="20" />
              </span>
              <input
                type="color"
                id="svg-color-picker"
                value={svgColor}
                onChange={(e) => setSvgColor(e.target.value)}
              />
            </div>
            <div className="pk2 d-flex align-items-center">
              <label htmlFor="background-color-picker" className="mx-2">Bg Color</label>
              <span className="drop-icon">
                <img src="http://localhost/headlesswp/the2px/wp-content/uploads/2024/10/dropdown-svgrepo-com.svg" alt="Drop Icon" width="20" height="20" />
              </span>
              <input
                type="color"
                id="background-color-picker"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid" id="mobile-nav">
        <div className="d-flex justify-content-between align-items-center">
          {/* Logo on the left */}
          <div className="navbar-brand" onClick={() => console.log('Brand clicked!')}>
            <img src="http://localhost/headlesswp/the2px/wp-content/uploads/2024/10/the2px-logo.svg" alt="the2px logo" className="navbar-logo" />
          </div>

          {/* Color pickers on the right */}
          <div className="d-flex align-items-center">
            <div className="pk1 d-flex align-items-center">
              <label htmlFor="svg-color-picker" className="me-2">Img Color</label>
              <span className="drop-icon">
                <img src="http://localhost/headlesswp/the2px/wp-content/uploads/2024/10/dropdown-svgrepo-com.svg" alt="Drop Icon" width="20" height="20" />
              </span>
              <input
                type="color"
                id="svg-color-picker"
                value={svgColor}
                onChange={(e) => setSvgColor(e.target.value)}
              />
            </div>

            <div className="pk2 d-flex align-items-center mx-3">
              <label htmlFor="background-color-picker" className="mx-2">Bg Color</label>
              <span className="drop-icon">
                <img src="http://localhost/headlesswp/the2px/wp-content/uploads/2024/10/dropdown-svgrepo-com.svg" alt="Drop Icon" width="20" height="20" />
              </span>
              <input
                type="color"
                id="background-color-picker"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Search bar in a new row */}
        <div className="search-bar mx-3 mt-3">
          <input
            type="text"
            placeholder="Search by tags..."
            className="form-control"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <span className="search-icon">
            <img src="http://localhost/headlesswp/the2px/wp-content/uploads/2024/10/search-svgrepo-com.svg" alt="Search Icon" width="20" height="20" />
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
