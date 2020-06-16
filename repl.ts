import { readLines } from "https://deno.land/std@0.53.0/io/bufio.ts";
import transpile from "./compiler/transpiler.ts";
import parse from "./compiler/parser.ts";
import tokenize from "./compiler/tokenizer.ts";
import { RUNTIME } from './compiler/common.ts';

const evil = eval;
const prompt = new TextEncoder().encode("> ");

evil(RUNTIME);

Deno.stdout.writeSync(prompt);
for await (const line of readLines(Deno.stdin)) {
    try {
        let ast = parse(tokenize(line))
        let js = ast[ast.length - 1]?.kind === 'declaration' 
            ? transpile(ast) 
            : '(' + transpile(ast) + ')';

        console.log(evil(js));
    } catch(err) {
        console.error(err);
    }
    Deno.stdout.writeSync(prompt);
}