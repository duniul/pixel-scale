export function findGCD(a: number, b: number): number {
  // Order arguments by size to immediately resolve if one value is 0 or 1.
  let x = Math.min(a, b);
  let y = Math.max(a, b);

  // Euclidean algorithm for finding GCD, non-recursive.
  let r: number;
  while (x % y > 0) {
    r = x % y;
    x = y;
    y = r;
  }

  return y;
}

export function findCommonDivisors(a: number, b: number): number[] {
  // This function does not use prime factorization or other performance
  // improvements since it is redundant for image dimensions.

  // Increment by 2 if a number is odd, since odd numbers only have odd divisors.
  const hasOdd = a % 2 !== 0 || b % 2 !== 0;
  const increment = hasOdd ? 2 : 1;

  const divisors = [];
  const gcd = findGCD(a, b);

  for (let num = 1; num * 2 <= gcd; num += increment) {
    if (gcd % num === 0) {
      divisors.push(num);
    }
  }

  divisors.push(gcd);

  return divisors;
}
