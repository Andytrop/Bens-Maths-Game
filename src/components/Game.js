// src/components/Game.js
import React, { useState, useEffect } from 'react';

const threshold = 3;

function generateProblem() {
  const operation = Math.random() < 0.5 ? 'multiply' : 'divide';
  let a = Math.floor(Math.random() * 10) + 1;
  let b = Math.floor(Math.random() * 10) + 1;
  if (operation === 'divide') {
    a = a * b;
  }
  return { a, b, operation };
}

const Game = () => {
  const [problem, setProblem] = useState(generateProblem());
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [joke, setJoke] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft]);

  // Effect for fetching a joke if the score qualifies
  useEffect(() => {
    if (gameOver && score >= threshold) {
      fetch('https://official-joke-api.appspot.com/jokes/random')
        .then((response) => response.json())
        .then((data) => setJoke(`${data.setup} ${data.punchline}`))
        .catch(() => setJoke("Couldn't load a joke this time."));
    }
  }, [gameOver, score]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let correctAnswer =
      problem.operation === 'multiply'
        ? problem.a * problem.b
        : problem.a / problem.b;
    if (parseInt(answer, 10) === correctAnswer) {
      setScore(score + 1);
    }
    setAnswer('');
    setProblem(generateProblem());
  };

  if (gameOver) {
    return (
      <div className="container text-center mt-5">
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
      </div>
    );
  }

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
