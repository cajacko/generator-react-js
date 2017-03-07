/* @flow */

function add(num1: number, num2: number) {
  return num1 + num2;
}

export default function () {
  const x: number = add(3, 0);

  return x;
}
