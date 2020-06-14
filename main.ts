
// import Tokenizer from './tokenizer.ts';

import tokenize from './tokenizer2.ts';

const tests = [
    `let mul = (a, b) => a * b`,
    `let num = 12 |> add(2) |> mul(3)`,
]

tests.forEach(test => {
    // const t = new Tokenizer(test)
    // const tokens = t.tokenize();

    const tokens = tokenize(test);
    
    console.log();
    console.log(test);
    console.log(tokens);
})