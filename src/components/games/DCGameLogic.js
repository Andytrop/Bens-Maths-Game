// src/components/games/DSGameLogic.js
export function generateProblem(difficulty) {
    // Randomly choose multiply or divide
    const operation = Math.random() < 0.5 ? 'multiply' : 'divide';
    let a, b;
  
    switch (difficulty) {
      case "easy": {
        // Use only the 2, 5, and 10 times tables.
        const factors = [2, 5, 10];
        a = factors[Math.floor(Math.random() * factors.length)];
        b = Math.floor(Math.random() * 12) + 1; // second factor from 1 to 12
        if (operation === 'divide') {
          // Ensure integer division by making a the product.
          a = a * b;
        }
        break;
      }
      case "medium": {
        // Numbers up to 12.
        a = Math.floor(Math.random() * 12) + 1;
        b = Math.floor(Math.random() * 12) + 1;
        if (operation === 'divide') {
          a = a * b;
        }
        break;
      }
      case "hard": {
        // One number can be anything up to 100, the other remains small (1–12).
        a = Math.floor(Math.random() * 100) + 1;
        b = Math.floor(Math.random() * 12) + 1;
        if (operation === 'divide') {
          a = a * b;
        }
        break;
      }
      case "ultra": {
        // One number up to 100 and one up to 1000.
        a = Math.floor(Math.random() * 100) + 1;
        b = Math.floor(Math.random() * 1000) + 1;
        if (operation === 'divide') {
          a = a * b;
        }
        break;
      }
      default: {
        // Fallback to medium.
        a = Math.floor(Math.random() * 12) + 1;
        b = Math.floor(Math.random() * 12) + 1;
        if (operation === 'divide') {
          a = a * b;
        }
        break;
      }
    }
    return { a, b, operation };
  }
  