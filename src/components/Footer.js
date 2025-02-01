// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ onPlayAgain, showHistoricScores = false }) => {
  return (
    <footer className="container mt-4">
      {/* Add a horizontal line to separate the footer */}
      <br/><p/><br/><p/>
      <hr />
      <div className="d-flex justify-content-center">
        {onPlayAgain && (
          <button className="btn btn-primary me-2" onClick={onPlayAgain}>
            Play Again
          </button>
        )}
        <Link className="btn btn-secondary me-2" to="/home">
          Home
        </Link>
        {showHistoricScores && (
          <Link className="btn btn-secondary" to="/historic-scores">
            Historic Scores
          </Link>
        )}
      </div>
    </footer>
  );
};

export default Footer;
