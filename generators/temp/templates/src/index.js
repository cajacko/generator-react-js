/* @flow */

// import _ from 'lodash';
import test from 'Src/test';

let woo;

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line
  woo = require('Src/prod');
} else {
  // eslint-disable-next-line
  woo = require('Src/dev');
}

test();

woo(3, 0);

function add(num1: number, num2: number) {
  return num1 + num2;
}

export default function () {
  const x: number = add(3, 0);

  return x;
}
