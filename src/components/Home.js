// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container text-center mt-5">
      <h3 className="mt-4">The Divide and Multiply Game</h3>
      <h5 className="mt-5">Choose your level ...</h5>
      <div className="d-flex flex-column align-items-center mt-3">
        <button className="btn btn-secondary mb-3" disabled>
          Easy (Coming Soon)
        </button>
        <Link to="/game" className="btn btn-primary mb-3">
          Medium
        </Link>
        <button className="btn btn-secondary mb-3" disabled>
          Hard (Coming Soon)
        </button>
      </div>
    </div>
  );
};

export default Home;

