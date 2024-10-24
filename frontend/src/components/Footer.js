import React from 'react';
import './Footer.css'; // Ensure you have the CSS file linked

const Footer = () => {
  return (
    <footer className="footer d-flex justify-content-between align-items-center p-2">
      {/* Logo on the left side */}
      <div className="footer-logo">
        <img src="https://react.the2px.com/wp-content/uploads/2024/10/the2px-logo.svg" alt="logo"  height="40" />
      </div>

      {/* Rights text on the right side */}
      <div className="footer-rights">
        <p>© 2024 Your Website. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
