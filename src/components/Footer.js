// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="container mt-4">
      <hr />
      <div className="d-flex justify-content-center">
        <Link className="btn btn-secondary me-2" to="/home">Home</Link>
        <Link className="btn btn-secondary" to="/historic-scores">Historic Scores</Link>
      </div>
    </footer>
  );
};

export default Footer;

