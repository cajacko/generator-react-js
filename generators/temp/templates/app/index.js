import _ from 'lodash';
import './test';

// const moment = require('moment');
// console.log('hello');

// console.log(moment().format());

function component() {
  const element = document.createElement('div');

  /* lodash is required for the next line to work */
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

// if (document.body) {
  document.body.appendChild(component());
// }
