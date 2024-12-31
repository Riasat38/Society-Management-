import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './LocalSupport.css';

const LocalSupport = () => {
  const [selectedInfo, setSelectedInfo] = useState(null);

  const infoData = {
    grocery: {
      title: 'Grocery Stores',
      details: [
        { name: 'Fresh Mart', address: '123 Market St, Townsville', phone: '555-1234', homeService: 'Yes' },
        { name: 'Daily Groceries', address: '456 Elm St, Townsville', phone: '555-5678', homeService: 'No' },
        { name: 'Green Grocer', address: '789 Oak St, Townsville', phone: '555-9101', homeService: 'Yes' },
      ],
    },
    laundry: {
      title: 'Laundry Services',
      details: [
        { name: 'Clean & Fresh Laundry', address: '321 Maple St, Townsville', phone: '555-1212', homeService: 'No' },
        { name: 'WashAway Laundry', address: '654 Pine St, Townsville', phone: '555-3434', homeService: 'Yes' },
        { name: 'Quick Clean Laundry', address: '987 Cedar St, Townsville', phone: '555-5656', homeService: 'No' },
      ],
    },
    supermarket: {
      title: 'Supermarkets',
      details: [
        { name: 'Super Mart', address: '111 Broadway, Townsville', phone: '555-7777', homeService: 'Yes' },
        { name: 'Town Supermarket', address: '222 Market St, Townsville', phone: '555-8888', homeService: 'No' },
        { name: 'Neighborhood Market', address: '333 Park Ave, Townsville', phone: '555-9999', homeService: 'Yes' },
      ],
    },
    housekeeping: {
      title: 'Housekeeping Services',
      details: [
        { name: 'Sparkle Cleaners', phone: '555-4444' },
        { name: 'Maid in Town', phone: '555-5555' },
        { name: 'Home Helpers', phone: '555-6666' },
      ],
    },
    pestControl: {
      title: 'Pest Control Services',
      details: [
        { name: 'Bug Busters', address: '101 Insect St, Townsville', phone: '555-1111', homeService: 'Yes' },
        { name: 'Pest Away', address: '202 Critter Ln, Townsville', phone: '555-2222', homeService: 'Yes' },
        { name: 'Safe Home Pest Control', address: '303 Bug Blvd, Townsville', phone: '555-3333', homeService: 'No' },
      ],
    },
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <header className="local-support-header">
          <h1>Local Support</h1>
          <p>
            Here is a list of local support services to make your life more convenient. Whether you need groceries, laundry services, or pest control, we've got you covered. Below, you'll find detailed information about the available services. Also you can contact housekeepng agencies for hiring househelp. Some nearby housekeeping Services are listed below.
          </p>
        </header>

        <div className="info-list">
          {Object.keys(infoData).map((infoKey) => (
            <div key={infoKey} className="info-item">
              <input
                type="checkbox"
                id={infoKey}
                checked={selectedInfo === infoKey}
                onChange={() => setSelectedInfo(selectedInfo === infoKey ? null : infoKey)}
                className="info-checkbox"
              />
              <label htmlFor={infoKey} className="info-title">
                {infoData[infoKey].title}
              </label>

              {selectedInfo === infoKey && (
                <div className="info-details">
                  <ul>
                    {infoData[infoKey].details.map((detail, index) => (
                      <li key={index}>
                        <strong>Name:</strong> {detail.name}<br />
                        {detail.address && <><strong>Address:</strong> {detail.address}<br /></>}
                        <strong>Phone:</strong> {detail.phone}<br />
                        {detail.homeService !== undefined && <><strong>Home Service:</strong> {detail.homeService}<br /></>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocalSupport;


