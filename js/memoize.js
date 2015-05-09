/**
 * @file Implements caching of function results.
 *
 * @see https://miguelmota.com/blog/memoization-caching-function-results-in-javascript/
 */

// Check for Local Storage Support
function supportLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] != null;
  } catch (e) {
    return false;
  }
}

// Memoization function.
Function.prototype.memoized = function() {
  // Values object for caching results.
  this._values = this._values || {};
  // Stringify function arguments to make key.
  var key = JSON.stringify(Array.prototype.slice.call(arguments));

  // Check if result is cached
  if (this._values[key] !== undefined) {
    console.log('Loaded from cache: %s => %s', key, this._values[key]);
    return this._values[key]

  // Check if result is in local storage.
  } else if (supportLocalStorage && localStorage[this.name+':'+key]) {
    /*console.log('Loaded from local storage: %s => %s', key, localStorage[this.name+':'+key]);*/
    return localStorage[this.name+':'+key];

    // Call the original function if result not found and store result.
  } else {
    var value = JSON.stringify(this.apply(this, arguments));
    // Store in local storage.
    if (supportLocalStorage) {
      localStorage[this.name+':'+key] = value;
    }
    /*console.log('New result: %s => %s', key, value);*/
    return this._values[key] = value;
  }
};

// Call the memoization function with the original function arguments.
Function.prototype.memoize = function() {
  var fn = this;
  return function() {
    return fn.memoized.apply(fn, arguments);
  };
};

// ======================================================================
// Usage examples below
// ======================================================================

// Check if number is prime function.
var isPrime = (function isPrime(num) {
  var prime = num != 1;
  for (var i = 2; i < num; i++) {
    if (num % i == 0) {
      prime = false;
      break;
    }
  }
  return prime;
}).memoize(); // Make function memoizable.

// Some function that accepts arguments and returns an object.
var someFunc = (function obj(a,b,c) {
  return {foo: (new Date()).getTime()};
}).memoize();

