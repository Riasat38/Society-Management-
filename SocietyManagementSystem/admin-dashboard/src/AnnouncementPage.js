// AnnouncementPage.js

import React, { useState } from 'react';
import './AnnouncementPage.css'; // Import the CSS for styles

function AnnouncementPage() {
  const [announcement, setAnnouncement] = useState("");

  const handleAnnouncementChange = (e) => {
    setAnnouncement(e.target.value);
  };

  const handleSubmit = () => {
    // Handle submission here, such as sending data to an API
    alert("Announcement submitted: " + announcement);
    setAnnouncement(""); // Clear the input after submission
  };

  return (
    <div 
      className="announcement-page-container" 
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1527767612165-ed1f4194a45c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG91c2luZyUyMHNvY2lldHl8ZW58MHx8MHx8fDA%3D')`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Updated header */}
      <header className="announcement-header">Make an Announcement</header>
      
      <textarea
        className="announcement-input"
        value={announcement}
        onChange={handleAnnouncementChange}
        placeholder="Write your announcement here..."
      />
      
      <button className="announcement-submit-button" onClick={handleSubmit}>
        Submit Announcement
      </button>
    </div>
  );
}

export default AnnouncementPage;
