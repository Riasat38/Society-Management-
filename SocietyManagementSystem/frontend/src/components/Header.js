import React, { useState } from 'react';
import './Header.css';

function Header() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const toggleAbout = () => setAboutOpen(!aboutOpen);
  const toggleContact = () => setContactOpen(!contactOpen);

  return (
    <header className="header">
      <nav className="nav-left">
        <div className="nav-item" onClick={toggleAbout}>
          <span className="nav-link">About Us</span>
          {aboutOpen && (
            <div className="dropdown-message">
              Heritage Garden is a prestigious community where members experience tranquility and luxury. Our society offers top-notch amenities and a friendly environment. Residents take pride in the well-maintained surroundings and active social life.
            </div>
          )}
        </div>
      </nav>
      <div className="logo">
        Heritage Garden
      </div>
      <nav className="nav-right">
        <div className="nav-item" onClick={toggleContact}>
          <span className="nav-link">Contact</span>
          {contactOpen && (
            <div className="dropdown-message">
              For any assistance, please contact:
              <br />+1-800-123-4567
              <br />+1-800-234-5678
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
