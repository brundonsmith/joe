
// import Tokenizer from './tokenizer.ts';

import tokenize from './tokenizer2.ts';
import { parse } from './parser.ts';
import transpile from './transpiler.ts';
import { parsingError, RUNTIME } from './common.ts';

const tests = [
`let f = (a, b) => a * b`,
`let num = 12 |> add(2) |> mul(3)`,
`let otherThings = tap(0..20 
    |> filter((x) => 1 < x / 2) 
    |> map(mul(2)))`,
`let foo = fib(index - 1) + fib(index - 2)`,
`let foo = index < 3 -> 1 -> fib(index - 1) + fib(index - 2)`,
`let fib = (index) =>
    index < 3 -> 1
      -> fib(index - 1) + fib(index - 2)
let sequence = tap(1..10 |> map(fib))
`,
`let nums = tap(3..9)`,
`let arr = [ 2, 3, 4 ]`,
`let obj = { foo: "stuff", bar: 12 }`,
`let obj = tap({ foo: "stuff", bar: 12 } & { prop: 5 })`,
]

const expected = [
`const f = (a) => (b) => OPERATORS['*'](a)(b);`,
`const num = mul(3)(add(2)(12));`,
`const otherThings = tap(map(mul(2))(filter((x) => OPERATORS['<'](1)(OPERATORS['/'](x)(2)))(new Array(20 - 0).fill(null).map((_, index) => 0 + index))));`,
`const foo = OPERATORS['+'](fib(OPERATORS['-'](index)(1)))(fib(OPERATORS['-'](index)(2)));`,
`const foo = OPERATORS['<'](index)(3) ? 1 : OPERATORS['+'](fib(OPERATORS['-'](index)(1)))(fib(OPERATORS['-'](index)(2)));`,
`const fib = (index) => OPERATORS['<'](index)(3) ? 1 : OPERATORS['+'](fib(OPERATORS['-'](index)(1)))(fib(OPERATORS['-'](index)(2)));
const sequence = tap(map(fib)(new Array(10 - 1).fill(null).map((_, index) => 1 + index)));`,
`const nums = tap(new Array(9 - 3).fill(null).map((_, index) => 3 + index));`,
`const arr = [ 2, 3, 4 ];`,
`const obj = { "foo": "stuff", "bar": 12 };`,
`const obj = tap(OPERATORS['&']({ "foo": "stuff", "bar": 12 })({ "prop": 5 }));`,
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
console.log(tests
    .filter((test, index) => expected[index] != null)
    .map((test, index) => 
        transpile(parse(tokenize(test))) === expected[index] ? `✓` : `FAILED`).join('\n'))
