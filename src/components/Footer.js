// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ onPlayAgain, showHistoricScores = true }) => {
  return (
    <footer className="container mt-4">
      <div className="d-flex justify-content-center">
        <button className="btn btn-primary me-2" onClick={onPlayAgain}>
          Play Again
        </button>
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
