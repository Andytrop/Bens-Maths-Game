// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container text-center mt-5">
      <h3 className="mt-4">The Divide and Multiply Game</h3>
      <h5 className="mt-5">Choose your level ...</h5>
      <div className="d-flex flex-column align-items-center mt-3">
        <Link to="/game/easy" className="btn btn-primary mb-3">
          Easy
        </Link>
        <Link to="/game/medium" className="btn btn-primary mb-3">
          Medium
        </Link>
        <Link to="/game/hard" className="btn btn-primary mb-3">
          Hard
        </Link>
        <Link to="/game/ultra" className="btn btn-primary mb-3">
          Ultra
        </Link>
      </div>
    </div>
  );
};

export default Home;
