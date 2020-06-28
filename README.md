
# What is this?

This is a pure-functional, JavaScript-targeted language I'm developing for 
fun/practice/experimentation. The guiding ethos is, "What I personally wish
the pure subset of JavaScript were like, with no outside constraints". It's 
comparable in philosophy to things like PureScript and ReasonML. I'm making it
because a) I'm learning to write compilers, and b) it's fun!

Key features:
- No statements or side-effects; only declarations
- Functions can be called in prefix, infix, or pipeline notation
- All functions are curry-able by default (can be partially applied)

# Examples

```javascript
// Joe
let f = (a, b) => a * b

// JavaScript
var f = (a) => (b) => OP['*'](a)(b);
```


```javascript
// Joe
let otherThings = 0..20 
    |> filter((x) => 1 < x / 2) 
    |> map(mul(2))

// JavaScript
var otherThings = 
    map(mul(2))(
        filter((x) => OP['<'](1)(OP['/'](x)(2)))(
            new Array(20 - 0).fill(null).map((_, index) => 0 + index)));
```

```javascript
// Joe
let fib = (index) =>
    index < 3 -> 1
              -> fib(index - 1) + fib(index - 2)

let sequence = 1..10 |> map(fib)


// JavaScript
var fib = (index) => 
    OP['<'](index)(3) ? 1 
                      : OP['+'](fib(OP['-'](index)(1)))(fib(OP['-'](index)(2)));

var sequence = map(fib)( new Array(10 - 1).fill(null).map((_, index) => 1 + index) );
```
