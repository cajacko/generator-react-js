/* @flow */

import moment from 'moment';
import test from 'Src/test';
import yeah from 'Src/woo';

let woo;

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line
  woo = require('Src/prod');
} else {
  // eslint-disable-next-line
  woo = require('Src/dev');
}

moment().format('MMMM Do YYYY, h:mm:ss a');

test();

// woo(3, 0);

function add(num1: number, num2: number) {
  return num1 + num2;
}

export default function () {
  const x: number = add(3, 0);

  return x;
}
