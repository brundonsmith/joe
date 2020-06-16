
import compile from './compiler/index.ts';

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
`var f = (a) => (b) => OPERATORS['*'](a)(b);`,
`var num = mul(3)(add(2)(12));`,
`var otherThings = tap(map(mul(2))(filter((x) => OPERATORS['<'](1)(OPERATORS['/'](x)(2)))(new Array(20 - 0).fill(null).map((_, index) => 0 + index))));`,
`var foo = OPERATORS['+'](fib(OPERATORS['-'](index)(1)))(fib(OPERATORS['-'](index)(2)));`,
`var foo = OPERATORS['<'](index)(3) ? 1 : OPERATORS['+'](fib(OPERATORS['-'](index)(1)))(fib(OPERATORS['-'](index)(2)));`,
`var fib = (index) => OPERATORS['<'](index)(3) ? 1 : OPERATORS['+'](fib(OPERATORS['-'](index)(1)))(fib(OPERATORS['-'](index)(2)));
var sequence = tap(map(fib)(new Array(10 - 1).fill(null).map((_, index) => 1 + index)));`,
`var nums = tap(new Array(9 - 3).fill(null).map((_, index) => 3 + index));`,
`var arr = [ 2, 3, 4 ];`,
`var obj = { "foo": "stuff", "bar": 12 };`,
`var obj = tap(OPERATORS['&']({ "foo": "stuff", "bar": 12 })({ "prop": 5 }));`,
]


tests.forEach(test => {
    console.log('\n\n\n----------------------------------------------------\n\n\n');

    let failedParse = false;
    const js = compile(test);
    console.log('JOE:\n' + test);
    console.log('JAVSCRIPT:\n' + js);

    if(!failedParse) {
        try {
            const jsr = compile(test, true);
            eval(jsr);
        } catch(err) {
            console.error(err)
        }
    }
})

console.log();
console.log(tests
    .filter((test, index) => expected[index] != null)
    .map((test, index) => 
        compile(test) === expected[index] ? `✓` : `FAILED`).join('\n'))
