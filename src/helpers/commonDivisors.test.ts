import { describe, expect, it } from 'vitest';
import { findCommonDivisors, findGCD } from './commonDivisors';

interface Sample {
  numbers: [number, number];
  divisors: number[];
}

const samples: Sample[] = [
  { numbers: [140, 90], divisors: [1, 2, 5, 10] },
  { numbers: [849273, 42837], divisors: [1, 3, 131, 393] },
  { numbers: [4234, 523], divisors: [1] },
  { numbers: [94238, 162374], divisors: [1, 2] },
  { numbers: [666, 999], divisors: [1, 3, 9, 37, 111, 333] },
  { numbers: [6855, 9445], divisors: [1, 5] },
  { numbers: [1402, 1402], divisors: [1, 2, 701, 1402] },
  { numbers: [84720, 74832], divisors: [1, 2, 3, 4, 6, 8, 12, 16, 24, 48] },
  { numbers: [846071539488, 846071537382], divisors: [1, 2, 3, 6, 9, 18, 27, 54, 81, 162] },
];

describe('findGCD', () => {
  describe('finds the greatest common divisor', () => {
    const tests: [number, number, number][] = samples.map(({ numbers, divisors }) => {
      const [a, b] = numbers;
      const [expectedGcd] = divisors.slice(-1);
      return [a, b, expectedGcd];
    });

    it.each(tests)('findGCD(%i, %i) = %i', (a, b, expected) => {
      expect(findGCD(a, b)).toEqual(expected);
    });
  });
});

describe('findCommonDivisors', () => {
  describe('finds all common divisors', () => {
    const tests: [number, number, number[]][] = samples.map(({ numbers, divisors }) => {
      const [a, b] = numbers;
      return [a, b, divisors];
    });

    it.each(tests)('findCommonDivisors(%i, %i) = %i', (a, b, expected) => {
      expect(findCommonDivisors(a, b)).toEqual(expected);
    });
  });
});
