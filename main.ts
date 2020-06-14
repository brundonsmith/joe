
// import Tokenizer from './tokenizer.ts';

import tokenize from './tokenizer2.ts';
import { parse } from './parser.ts';
import transpile from './transpiler.ts';

const RUNTIME = `
const add = (a) => (b) => a + b;
const sub = (a) => (b) => a - b;
const mul = (a) => (b) => a * b;
const div = (a) => (b) => a / b;

const is = (a) => (b) => a === b;
const greater = (a) => (b) => a > b;
const less = (a) => (b) => a < b;
const greaterEqual = (a) => (b) => a >= b;
const lessEqual = (a) => (b) => a < b;

const map = (func) => (arr) => arr.map(func);
const reduce = (init) => (func) => (arr) => arr.reduce(func, init);
const filter = (func) => (arr) => arr.filter(func);
const some = (func) => (arr) => arr.some(func);
const every = (func) => (arr) => arr.every(func);

const log = console.log;

const OPERATORS = {
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
};
`

const tests = [
    `let f = (a, b) => a * b`,
    `let num = 12 |> add(2) |> mul(3)`,
    `let otherThings = things 
        |> filter((x) => x / 2 > 1) 
        |> map(mul(2))`,
    `let foo = fib(index - 1) + fib(index - 2)`,
    `let foo = index < 3 -> 1 -> fib(index - 1) + fib(index - 2)`,
    `let fib = (index) =>
        index < 3 -> 1
                  -> fib(index - 1) + fib(index - 2)
    `
]

tests.forEach(test => {
    // const t = new Tokenizer(test)
    // const tokens = t.tokenize();

    
    console.log('\n\n\n----------------------------------------------------\n\n\n');

    const tokens = tokenize(test);
    // console.log(tokens);

    const ast = parse(tokens);
    // console.log(JSON.stringify(ast, null, 2))

    const js = transpile(ast);
    console.log('JOE:\n' + test);
    console.log('JAVSCRIPT:\n' + js);

    try {
        eval(RUNTIME + '\n' + js)
    } catch(err) {
        console.error(err)
    }

})
