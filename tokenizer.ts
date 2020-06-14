
import { Token, TokenType, LiteralValue, KEYWORDS } from "./model.ts";

export default class Scanner {
    private source: string;

    constructor(source: string) {
        this.source = source;
    }

    private start = 0;
    private current = 0;
    private line = 0;
    
    private tokens: Token[] = [];

    tokenize(): Token[] {
        while(!this.atEnd) {
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push({ type: 'eof', lexeme: "", literal: null, line: this.line });
        return this.tokens;
    }

    private scanToken() {
        let c = this.advance();

        switch(c) {
            case ' ':
            case '\r':
            case '\t':
                break;
            case '\n':
                this.line++;
                break;
            case ',':
            case '(':
            case ')':
            case '{':
            case '}':
            case '[':
            case ']':
            case '.':
            case ':':
                this.addToken(c);
                break;
            case '/':
                if (this.match('/')) {
                    while (this.peek !== '\n' && !this.atEnd) this.advance();
                } else if(this.match('*')) {
                    while ((this.peek !== '*' || this.peekNext !== '/') && !this.atEnd) this.advance();
                    this.advance();
                    this.advance();
                }
                break;
            case '"': 
                this.string(); 
                break;
            default:
                if (c === '=' && this.peek === '>') {
                    console.log('matched =>')
                    this.advance();
                    this.addToken('=>');
                } else if (c === '=' && !isValidIdentifier(this.peek)) {
                    this.addToken('=');
                } else if (c === '-' && this.peek === '>') {
                    this.advance();
                    this.addToken('->');
                } else if (c === '|' && this.peek === '>') {
                    this.advance();
                    this.addToken('|>');
                } else if (isDigit(c)) {
                    this.number();
                } else if(isValidIdentifier(c)) {
                    console.log(c, isValidIdentifier(c))
                    this.identifier();
                } else {
                    console.error(this.line, `Unexpected character '${c}'.`)
                    // parsingError(this.line, "Unexpected character.");
                }
                break;
        }
    }

    private string() {
        while (this.peek !== '"' && !this.atEnd) {
            if (this.peek === '\n') this.line++;
            this.advance();
        }

        if (this.atEnd) {
            // parsingError(this.line, "unterminated string.");
        } else {
            this.advance();

            let value = this.source.substring(this.start + 1, this.current - 1);
            this.addToken('string', value);
        }
    }

    private number() {
        while (isDigit(this.peek)) this.advance();

        if (this.peek === '.' && isDigit(this.peekNext)) {
            this.advance();
            while(isDigit(this.peek)) this.advance();
        }

        this.addToken('number', Number(this.currentToken));
    }

    private identifier() {
        while (isValidIdentifier(this.peek) && !this.atEnd) this.advance();

        this.addToken('identifier', this.currentToken);
    }



    // computed properties
    get peek(): string {
        if (this.atEnd) {
            return '\0';
        } else {
            return this.source[this.current];
        }
    }

    get peekNext(): string {
        if (this.current + 1 >= this.source.length) {
            return '\0';
        } else {
            return this.source[this.current + 1];
        }
    }

    get currentToken(): string {
        return this.source.substring(this.start, this.current);
    }

    get atEnd(): boolean {
        return this.current >= this.source.length;
    }

    // basic operations
    private match(expected: string): boolean { // check-and-consume
        if (this.peek === expected) {
            this.advance();
            return true;
        } else {
            return false;
        }
    }

    private advance(): string {
        this.current++;
        return this.source[this.current - 1];
    }

    private addToken(type: TokenType, literal: LiteralValue = null) {
        let lexeme = this.currentToken;
        this.tokens.push({ type, lexeme, literal, line: this.line });
    }
}

function isDigit(char: string): boolean {
    return char.match(/^[0-9]$/) != null;
}

function isAlpha(char: string): boolean {
    return char.match(/^[_a-zA-Z]$/) != null;
}

function isValidIdentifier(char: string): boolean {
    return !isWhiteSpace(char) && !(KEYWORDS as readonly string[]).includes(char);
}

function isWhiteSpace(char: string): boolean {
    return char.match(/[\s]+/) != null;
}