// src/components/Game.js
import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

// Set threshold to 3 for a joke reward and celebration
const threshold = 3;

// Generate a random math problem (multiplication or division)
function generateProblem() {
  const operation = Math.random() < 0.5 ? 'multiply' : 'divide';
  let a = Math.floor(Math.random() * 10) + 1;
  let b = Math.floor(Math.random() * 10) + 1;
  if (operation === 'divide') {
    a = a * b; // ensures division results in an integer
  }
  return { a, b, operation };
}

const Game = () => {
  // Initialize state
  const [problem, setProblem] = useState(generateProblem());
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  // Set the timer to 20 seconds
  const [timeLeft, setTimeLeft] = useState(20);
  const [joke, setJoke] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [history, setHistory] = useState([]); // tracks user attempts

  // State to control confetti visibility
  const [showConfetti, setShowConfetti] = useState(false);

  // Timer effect: decrease time every second until time runs out
  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft]);

  // Effect for fetching a joke and showing confetti if the user meets or exceeds the threshold
  useEffect(() => {
    if (gameOver && score >= threshold) {
      fetch('https://official-joke-api.appspot.com/jokes/random')
        .then((response) => response.json())
        .then((data) => setJoke(`${data.setup} ${data.punchline}`))
        .catch(() => setJoke("Couldn't load a joke this time."));

      // Enable confetti when game is over and score is high enough
      setShowConfetti(true);

      // Hide confetti after 5 seconds
      const confettiTimeout = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => clearTimeout(confettiTimeout);
    }
  }, [gameOver, score]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calculate the correct answer based on the problem
    const correctAnswer =
      problem.operation === 'multiply'
        ? problem.a * problem.b
        : problem.a / problem.b;

    const userAnswer = parseInt(answer, 10);

    // Update the score if the answer is correct
    if (userAnswer === correctAnswer) {
      setScore(score + 1);
    }

    // Create a record of the attempt
    const record = {
      problem:
        problem.operation === 'multiply'
          ? `${problem.a} x ${problem.b}`
          : `${problem.a} ÷ ${problem.b}`,
      userAnswer: answer,
      correctAnswer: correctAnswer,
      isCorrect: userAnswer === correctAnswer,
    };
    setHistory((prevHistory) => [...prevHistory, record]);

    // Clear the answer and generate the next problem
    setAnswer('');
    setProblem(generateProblem());
  };

  // Function to restart the game
  const restartGame = () => {
    setScore(0);
    setTimeLeft(20);
    setHistory([]);
    setGameOver(false);
    setJoke(null);
    setShowConfetti(false);
    setProblem(generateProblem());
  };

  // When the game is over, display the summary, joke, and confetti if applicable
  if (gameOver) {
    return (
      <div className="container text-center mt-5" style={{ position: 'relative' }}>
        {/* Conditionally render confetti if active */}
        {score >= threshold && showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            gravity={0.1}  // Lower gravity for a slower descent
            numberOfPieces={100} // Reduced number of pieces
          />
        )}
        <h2>Time's up!</h2>
        <p>Your score: {score}</p>
        {score >= threshold ? (
          <div>
            <h3>Congratulations! Here's your joke:</h3>
            <p>{joke ? joke : 'Loading joke...'}</p>
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
        {/* Play Again Button */}
        <button className="btn btn-primary mt-4" onClick={restartGame}>
          Play Again
        </button>
      </div>
    );
  }

  // During the game, show the current problem, timer, and score
  return (
    <div className="container text-center mt-5">
      <h2>Math Game</h2>
      <p>Time Left: {timeLeft} seconds</p>
      <p>Score: {score}</p>
      <div className="my-4">
        <p className="fs-4">
          {problem.operation === 'multiply'
            ? `${problem.a} x ${problem.b}`
            : `${problem.a} ÷ ${problem.b}`}
        </p>
        <form onSubmit={handleSubmit} className="d-flex justify-content-center">
          <input
            type="number"
            className="form-control w-50 me-2"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn btn-success">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Game;
