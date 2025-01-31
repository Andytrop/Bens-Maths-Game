// src/components/Game.js
import React, { useState, useEffect } from 'react';

const threshold = 5; // Example threshold for receiving a joke

function generateProblem() {
  const operation = Math.random() < 0.5 ? 'multiply' : 'divide';
  let a = Math.floor(Math.random() * 10) + 1;
  let b = Math.floor(Math.random() * 10) + 1;
  
  if (operation === 'divide') {
    a = a * b; // ensure division has an integer result
  }
  
  return { a, b, operation };
}

const Game = () => {
  const [problem, setProblem] = useState(generateProblem());
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [joke, setJoke] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      // Check if score qualifies for a joke
      if (score >= threshold) {
        // You can replace this with an API call to fetch a joke.
        setJoke("Why was the math book sad? Because it had too many problems!");
      }
      return;
    }
    const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft, score]);

  const handleSubmit = e => {
    e.preventDefault();
    let correctAnswer;
    if (problem.operation === 'multiply') {
      correctAnswer = problem.a * problem.b;
    } else {
      correctAnswer = problem.a / problem.b;
    }
    if (parseInt(answer, 10) === correctAnswer) {
      setScore(score + 1);
    }
    setAnswer('');
    setProblem(generateProblem());
  };

  if (gameOver) {
    return (
      <div>
        <h2>Time's up!</h2>
        <p>Your score: {score}</p>
        {score >= threshold ? (
          <div>
            <h3>Congratulations! Here's your joke:</h3>
            <p>{joke}</p>
          </div>
        ) : (
          <p>Good effort! Try again to earn a joke.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <h2>Bens Awesome Math Game</h2>
      <p>Time Left: {timeLeft} seconds</p>
      <p>Score: {score}</p>
      <div>
        <p>
          {problem.operation === 'multiply'
            ? `${problem.a} x ${problem.b}`
            : `${problem.a} ÷ ${problem.b}`}
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            autoFocus
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Game;
