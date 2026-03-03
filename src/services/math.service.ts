import { Injectable } from '@angular/core';
import { Level, Problem } from '../models';

@Injectable({ providedIn: 'root' })
export class MathService {
  private generateProblems(operations: { x: number, y: number }[]): Problem[] {
    return operations.map(op => {
      // Randomly swap operands to ensure student isn't just memorizing the equation order
      if (Math.random() > 0.5) {
        [op.x, op.y] = [op.y, op.x];
      }
      return {
        question: `${op.x} + ${op.y}`,
        answer: op.x + op.y,
      };
    });
  }

  getLevels(): Level[] {
    // Pink: 0+1 to 0+10
    const pinkOps = Array.from({ length: 10 }, (_, i) => ({ x: 0, y: i + 1 }));

    // Purple: 10+0 to 10+10
    const purpleOps = Array.from({ length: 11 }, (_, i) => ({ x: 10, y: i }));

    // Blue: 1+1 thru 9+3 (Interpreted as various smaller additions)
    const blueOps = [
      {x: 1, y: 1}, {x: 1, y: 2}, {x: 2, y: 1}, {x: 2, y: 2}, {x: 3, y: 1}, {x: 3, y: 2},
      {x: 4, y: 1}, {x: 4, y: 2}, {x: 5, y: 1}, {x: 5, y: 2}, {x: 1, y: 3}, {x: 2, y: 3},
      {x: 3, y: 3}, {x: 4, y: 3}, {x: 5, y: 3}, {x: 6, y: 1}, {x: 6, y: 2}, {x: 6, y: 3},
      {x: 7, y: 1}, {x: 7, y: 2}, {x: 7, y: 3}, {x: 8, y: 1}, {x: 8, y: 2}, {x: 9, y: 1}, {x: 9, y: 2}
    ];

    // Green: 6+4 thru 9+7
    const greenOps = [
      {x: 6, y: 4}, {x: 6, y: 5}, {x: 6, y: 6}, {x: 6, y: 7},
      {x: 7, y: 4}, {x: 7, y: 5}, {x: 7, y: 6}, {x: 7, y: 7},
      {x: 8, y: 4}, {x: 8, y: 5}, {x: 8, y: 6}, {x: 9, y: 4},
      {x: 9, y: 5}, {x: 9, y: 6}, {x: 9, y: 7}
    ];

    // Yellow: 2+2, 3+2 thru 9+9 (Harder additions)
    const yellowOps = [
        {x: 2, y: 2}, {x: 3, y: 2}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 4},
        {x: 5, y: 5}, {x: 6, y: 6}, {x: 7, y: 7}, {x: 8, y: 8}, {x: 9, y: 9},
        {x: 4, y: 5}, {x: 5, y: 4}, {x: 5, y: 6}, {x: 6, y: 5}, {x: 6, y: 8},
        {x: 8, y: 6}, {x: 7, y: 8}, {x: 8, y: 7}, {x: 7, y: 9}, {x: 9, y: 7},
        {x: 8, y: 9}, {x: 9, y: 8}
    ];

    const allOps = [...pinkOps, ...purpleOps, ...blueOps, ...greenOps, ...yellowOps];

    return [
      { name: 'Pink', description: '0 + 1 to 0 + 10', color: 'bg-pink-500', hoverColor: 'hover:bg-pink-600', problems: this.generateProblems(pinkOps) },
      { name: 'Purple', description: '10 + 0 to 10 + 10', color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600', problems: this.generateProblems(purpleOps) },
      { name: 'Blue', description: 'Easy additions (e.g., 1+1)', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600', problems: this.generateProblems(blueOps) },
      { name: 'Green', description: 'Medium additions (e.g., 6+4)', color: 'bg-green-500', hoverColor: 'hover:bg-green-600', problems: this.generateProblems(greenOps) },
      { name: 'Yellow', description: 'Hard additions (e.g., 9+9)', color: 'bg-yellow-500', hoverColor: 'hover:bg-yellow-600', problems: this.generateProblems(yellowOps) },
      { name: 'Random Additions', description: 'All problems mixed!', color: 'bg-red-500', hoverColor: 'hover:bg-red-600', problems: this.generateProblems(allOps) },
    ];
  }

  /**
   * Shuffles an array of problems and returns a specific number of them.
   * @param problems The array of problems to shuffle and sample from.
   * @param count The number of problems to return.
   * @returns A new array containing the sampled problems.
   */
  shuffleAndSampleProblems(problems: Problem[], count: number): Problem[] {
    const shuffled = [...problems];
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Return a slice of the array with the desired count
    return shuffled.slice(0, count);
  }
}