import { Token, TokenType, Declaration, Node, Expression, OPERATORS } from "./model.ts";


export function parse(tokens: Token[], errorCallback: (tokenOrLineNumber: Token|number, message: string) => any = () => {}): Node[] {
    let declarations: Node[] = [];

    let current = 0;
    while(current < tokens.length) {
        const decl = declaration();
        if (decl != null) {
            declarations.push(decl);
        }
    }


    // functions
    function eat(expected: TokenType): Token {
        if (tokens[current]?.type === expected) {
            const token = tokens[current];
            current++;
            return token;
        } else {
            throw new ParseError(tokens[current], `Unexpected token, expected ${expected}`);
        }
    }

    function declaration(): Node|null {
        try {
            if (tokens[current].type === 'let') {
                eat('let');
                const name = eat('identifier');
                eat('=');
                const initializer = expression();

                return { kind: 'declaration', name, initializer }
            } else {
                return expression();
            }
        } catch (err) {
            errorCallback(err.tokenOrLineNumber, err.message);
            synchronize();
            return null;
        }
    }
    
    function synchronize() {
        current++;

        while (current < tokens.length && tokens[current].type !== 'let') {
            current++;
        }
    }

    function expression(): Expression {
        return conditional();
    }

    function conditional(): Expression {
        let expr = func();

        while (tokens[current]?.type === '->') {
            eat('->');
            let case1 = func();

            if (tokens[current]?.type === '->') {
                eat('->');
                let case2 = func();
                
                expr = { kind: 'conditional', condition: expr, case1, case2 };
            }
        }

        return expr;
    }

    function func(): Expression {
        if (tokens[current]?.type === '(' && (tokens[current + 1]?.type === ')' || (tokens[current + 1]?.type === 'identifier' && (tokens[current + 2]?.type === ',' || tokens[current + 2]?.type === ')')))) {
            eat('(');

            let params = [];
            if (tokens[current]?.type === 'identifier') {
                params.push(eat('identifier'));

                while(tokens[current]?.type === ',') {
                    eat(',');
                    params.push(eat('identifier'));
                }
            }

            eat(')');
            eat('=>');
            
            const body = expression();

            return { kind: 'function-literal', params, body };
        } else {
            return callInfix();
        }
    }

    function callInfix(): Expression {
        let expr = callPipe();

        if (tokens[current]?.type === 'identifier') {
            let name = eat('identifier');
            let arg1 = callInfix();

            return { 
                kind: 'call', 
                func: {
                    kind: (OPERATORS as readonly string[]).includes(name.lexeme) ? 'operator-identifier' : 'identifier', 
                    name 
                }, 
                args: [ expr, arg1 ]
            };
        }

        return expr;
    }

    function callPipe(): Expression {
        let expr = callPrefix();

        while (tokens[current]?.type === '|>') {
            eat('|>');
            let func = callPrefix();

            expr = { kind: 'call', func, args: [ expr ] };
        }

        return expr;
    }

    function callPrefix(): Expression {
        let expr = primary();

        if (tokens[current]?.type === '(' && !tokens[current]?.whitespaceBefore) {
            eat('(');

            let args = [];
            if (tokens[current]?.type !== ')') {
                do {
                    args.push(expression());
                } while (tokens[current]?.type === ',')
            }

            eat(')');

            return { kind: 'call', func: expr, args }
        }

        return expr;
    }

    function primary(): Expression {
        if (tokens[current]?.type === 'false') return { kind: 'literal', value: false };
        if (tokens[current]?.type === 'true') return { kind: 'literal', value: true };
        if (tokens[current]?.type === 'undefined') return { kind: 'literal', value: undefined };
        if (tokens[current]?.type === 'number' || tokens[current]?.type === 'string') return { kind: 'literal', value: eat(tokens[current]?.type).literal };
        if (tokens[current]?.type === 'identifier') {
            let name = eat('identifier');
            let kind: 'operator-identifier' | 'identifier' = (OPERATORS as readonly string[]).includes(name.lexeme) ? 'operator-identifier' : 'identifier';

            return { kind, name };
        }

        throw new ParseError(tokens[current], `Expected expression`);
    }


    // function array(): Expression {

    // }

    // function object(): Expression {

    // }


    // function callInfix(): Expression {

    // }

    // function callUnary(): Expression {

    // }


    // function conditional(): Expression {

    // }


    // function parenths(): Expression {

    // }

    
    return declarations;
}

class ParseError {

    tokenOrLineNumber: Token|number;
    message: string;

    constructor(tokenOrLineNumber: Token|number, message: string) {
        this.tokenOrLineNumber = tokenOrLineNumber;
        this.message = message;
    }
}