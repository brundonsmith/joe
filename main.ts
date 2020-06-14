
// import Tokenizer from './tokenizer.ts';

import tokenize from './tokenizer2.ts';
import { parse } from './parser.ts';
import transpile from './transpiler.ts';
import { Token } from './model.ts';

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

const tap = (x) => {
    console.log(x);
    return x;
};

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
    |> filter((x) => 1 < x / 2) 
    |> map(mul(2))`,
`let foo = fib(index - 1) + fib(index - 2)`,
`let foo = index < 3 -> 1 -> fib(index - 1) + fib(index - 2)`,
`let fib = (index) =>
    index < 3 -> 1
    -> fib(index - 1) + fib(index - 2)
let f1 = tap(fib(1))
let f2 = tap(fib(2))
let f3 = tap(fib(3))
let f4 = tap(fib(4))
let f5 = tap(fib(5))
let f6 = tap(fib(6))
let f7 = tap(fib(7))
`
]

const expected = [
`const f = (a) => (b) => OPERATORS['*'](a)(b);`,
`const num = mul(3)(add(2)(12));`,
`const otherThings = map(mul(2))(filter((x) => OPERATORS['<'](1)(OPERATORS['/'](x)(2)))(things));`,
`const foo = OPERATORS['+'](fib(OPERATORS['-'](index)(1)))(fib(OPERATORS['-'](index)(2)));`,
`const foo = OPERATORS['<'](index)(3) ? 1 : OPERATORS['+'](fib(OPERATORS['-'](index)(1)))(fib(OPERATORS['-'](index)(2)));`,
`const fib = (index) => OPERATORS['<'](index)(3) ? 1 : OPERATORS['+'](fib(OPERATORS['-'](index)(1)))(fib(OPERATORS['-'](index)(2)));
const f1 = tap(fib(1));
const f2 = tap(fib(2));
const f3 = tap(fib(3));
const f4 = tap(fib(4));
const f5 = tap(fib(5));
const f6 = tap(fib(6));
const f7 = tap(fib(7));`
]


tests.forEach(test => {
    console.log('\n\n\n----------------------------------------------------\n\n\n');

    const tokens = tokenize(test);
    // console.log(tokens);

    let failedParse = false;
    const ast = parse(tokens, (...args) => { parsingError(...args); failedParse = true; });
    // console.log(JSON.stringify(ast, null, 2))

    const js = transpile(ast);
    console.log('JOE:\n' + test);
    console.log('JAVSCRIPT:\n' + js);

    if(!failedParse) {
        try {
            eval(RUNTIME + '\n' + js)
        } catch(err) {
            console.error(err)
        }
    }
})

console.log();
console.log(tests.filter((test, index) => expected[index] != null).map((test, index) => transpile(parse(tokenize(test))) === expected[index] ? `✓` : `FAILED`).join('\n'))

function parsingError(tokenOrLineNumber: Token|number, message: string) {
    if(typeof tokenOrLineNumber === 'number') {
        report(tokenOrLineNumber, "", message);
    } else {
        if (tokenOrLineNumber.type === 'eof') {
            report(tokenOrLineNumber.line, " at end", message);
        } else {
            report(tokenOrLineNumber.line, " at '" + tokenOrLineNumber.lexeme + "'", message);
        }
    }
}

function report(line: number, where: string, message: string) {
    console.error(`[line ${line}] Error${where}: ${message}`);
}