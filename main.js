import {expressionCalculator} from "./polish_notation.js";

console.log(expressionCalculator(' sin ( 90 ) + ( 35 * 2 / 70 ) * 10 '));
console.log(expressionCalculator('M * [ 8 , i - 4 , cos ( A ) , k * 4 ] ^ 6'));
// console.log(expressionCalculator('2 + sin ( ( ( ( ( 90 )'));
console.log(expressionCalculator('2 + sin ( 90 )'));
console.log(expressionCalculator('A * ( a * b ) '));
console.log(expressionCalculator('2 * 3'));
console.log(expressionCalculator(' 60 + 30 / 2 - 85 '));
console.log(expressionCalculator('( ( 1 + 2 * 3'));
console.log(expressionCalculator(' 85 * 2 / (  88 / 11 - 18 * 1 ) - 61 '));
console.log(expressionCalculator('99 - 78 * (  (  (  63 + 52 / 67 + 26 / 29  ) + 94 + (  68 - 11 / 1 * 88  ) + 49  ) / 69 * 15 * 8  ) - 1 '));
