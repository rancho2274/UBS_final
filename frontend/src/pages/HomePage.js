// frontend/src/pages/HomePage.js
import React from 'react';
import EntitySelection from '../components/auth/EntitySelection';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <main className="container">
          
          <div className="">
            <EntitySelection />
          </div>
      </main>
    </div>
  );
};

export default HomePage;