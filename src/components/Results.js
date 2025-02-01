// src/components/Results.js
import React from 'react';
import Confetti from 'react-confetti';

const Results = ({ score, joke, history, restartGame, showConfetti, threshold }) => {
  return (
    <div className="container text-center mt-5" style={{ position: 'relative' }}>
      {score >= threshold && showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          gravity={0.1}
          numberOfPieces={100}
        />
      )}
      <h2>Time's up!</h2>
      <p>Your score: {score}</p>
      {score >= threshold ? (
        <div className="alert alert-info" role="alert">
          <h5>Congratulations! Here's your joke:</h5>
          {joke ? joke : 'Loading joke...'}
        </div>
      ) : (
        <p>Good effort! Try again to earn a joke.</p>
      )}
      <hr />
      <h3>Answer Summary</h3>
      {history.length > 0 ? (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Problem</th>
              <th>Your Answer</th>
              <th>Correct Answer</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{record.problem}</td>
                <td>{record.userAnswer}</td>
                <td>{record.correctAnswer}</td>
                <td>
                  {record.isCorrect ? (
                    <span className="text-success">Correct</span>
                  ) : (
                    <span className="text-danger">Incorrect</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No attempts recorded.</p>
      )}
      {/* Play Again button displayed inside the results view */}
      <button className="btn btn-primary mt-4" onClick={restartGame}>
        Play Again
      </button>
    </div>
  );
};

export default Results;
