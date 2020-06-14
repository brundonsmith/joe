
import { Token, TokenType, KEYWORDS } from "./model.ts";

export default function tokenize(source: string): Token[] {
    let tokens: Token[] = [];
    let start = 0;
    let line = 0;
    let current = 0;
    let whitespaceBefore = true;

    function peek() {
        return current >= source.length
            ? '\0'
            : source[current];
    }

    function peekNext() {
        return current + 1 >= source.length
            ? '\0'
            : source[current + 1];
    }

    function currentToken() {
        return source.substring(start, current);
    }

    function eat(expected: string): boolean {
        let i = 0;
        while (i < expected.length && expected[i] === source[current + i]) {
            i++;
        }

        if (i < expected.length) { // not found
            return false;
        } else { // found
            current += expected.length;
            return true;
        }
    }

    while (current < source.length) {
        start = current;

        whitespaceBefore = isWhiteSpace(source[current]);

        if ([ ' ', '\r', '\t' ].some(eat)) {
            // skip
        } else if (eat('\n')) {
            line++;
            // skip
        } else if ([ ',', '(', ')', '{', '}', '[', ']', '..', '.', ':', '=>', '->', '|>' ].some(eat)) {
            tokens.push({
                type: currentToken() as TokenType,
                lexeme: currentToken(),
                line,
                whitespaceBefore
            });
        } else if (eat('//')) {
            while (peek() !== '\n' && current < source.length) current++;
        } else if (eat('/*')) {
            while (!eat('*/') && current < source.length) current++;
        } else if (!isValidIdentifier(peekNext()) && eat('=')) {
            tokens.push({
                type: currentToken() as TokenType,
                lexeme: currentToken(),
                line,
                whitespaceBefore
            });
        } else if (eat('"')) {
            while (!eat('"') && current < source.length) {
                if (peek() === '\n') line++;
                current++;
            }

            if (current >= source.length) {
                // parsingError(this.line, "unterminated string.");
            } else {
                const literal = currentToken().substring(1, currentToken().length - 1);
                tokens.push({
                    type: 'string',
                    lexeme: currentToken(),
                    line,
                    whitespaceBefore,
                    literal
                });
            }
        } else if (isDigit(peek())) {
            while (isDigit(peek()) && current < source.length) current++;

            if (peek() === '.' && isDigit(peekNext())) {
                current++;
                while(isDigit(peek())) current++;
            }

            tokens.push({
                type: 'number',
                lexeme: currentToken(),
                line,
                whitespaceBefore,
                literal: Number(currentToken())
            });
        } else if(isValidIdentifier(peek())) {
            while (isValidIdentifier(peek()) && current < source.length) current++;

            const token = currentToken();
            const type = 
                (KEYWORDS as readonly string[]).includes(token) 
                    ? <TokenType> token 
                    : 'identifier';

            tokens.push({
                type,
                lexeme: token,
                line,
                whitespaceBefore,
                literal: token
            });
        } else {
            console.error(line, `Unexpected character '${peek()}'.`)
        }
    }

    return tokens;
}

function isDigit(char: string): boolean {
    return char.match(/^[0-9]$/) != null;
}

function isValidIdentifier(char: string): boolean {
    return !isWhiteSpace(char) && !(KEYWORDS as readonly string[]).includes(char);
}

function isWhiteSpace(char: string): boolean {
    return char.match(/[\s]+/) != null;
}