
export var RUNTIME = `
var add = (a) => (b) => a + b;
var sub = (a) => (b) => a - b;
var mul = (a) => (b) => a * b;
var div = (a) => (b) => a / b;

var is = (a) => (b) => a === b;
var greater = (a) => (b) => a > b;
var less = (a) => (b) => a < b;
var greaterEqual = (a) => (b) => a >= b;
var lessEqual = (a) => (b) => a < b;

var given = (val) => (func) => val != null ? func(val) : val;

// array functions
var map = (func) => (arr) => given(arr)(arr => arr.map(func));
var reduce = (init) => (func) => (arr) => given(arr)(arr => arr.reduce(func, init));
var filter = (func) => (arr) => given(arr)(arr => arr.filter(func));
var some = (func) => (arr) => given(arr)(arr => arr.some(func));
var every = (func) => (arr) => given(arr)(arr => arr.every(func));
var length = (arr) => given(arr, arr => arr.length);
var slice = (start) => (arr) => (length) => given(arr, arr => arr.slice(start, length))

// string functions
var toLowerCase = (str) => given(str)(str => str.toLowerCase());
var toUpperCase = (str) => given(str)(str => str.toUpperCase());

var log = (x) => {
    console.log(x);
    return x;
};

var OP = {
    '+': add,
    '-': sub,
    '*': mul,
    '/': div,

    '==': is,
    '!=': (a) => (b) => a !== b,
    '>': greater,
    '<': less,
    '>=': greaterEqual,
    '<=': lessEqual,

    '&': (obj1) => (obj2) => ({ ...obj1, ...obj2 }),
};
`
