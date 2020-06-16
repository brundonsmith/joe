
import tokenize from './tokenizer.ts';
import parse from './parser.ts';
import transpile from './transpiler.ts';
import { Token } from './model.ts';
import { RUNTIME } from './common.ts';

export default function compile(source: string, withRuntime?: boolean): string {
    return (withRuntime ? RUNTIME + '\n\n' : '') + transpile(parse(tokenize(source), parsingError));
}

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