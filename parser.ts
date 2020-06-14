import { Token, TokenType, Declaration } from "./model.ts";

export default class Parser {
    private tokens: Token[];
    private current: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    public parse(): Declaration[] {
        let statements: Declaration[] = [];

        while(!this.atEnd) {
            let statement = this.declaration();
            if(statement != null) {
                statements.push(statement);
            }
        }

        return statements;
    }

    private declaration(): Declaration|null {
        try {
            if (this.match('let')) {
                return this.
            }
        } catch (err) {
            this.synchronize();
            return null;
        }
    }

    private match(...tokenTypes: TokenType[]): boolean {
        for (let tokenType of tokenTypes) {
            if (this.check(tokenType)) {
                this.advance();
                return true;
            }
        }

        return false;
    }

    private consume(tokenType: TokenType, errorMessage: string): Token {
        if(this.check(tokenType)) {
            return this.advance();
        } else {
            throw this.error(this.peek, errorMessage);
        }
    }

    private synchronize() {
        this.advance();

        while (!this.atEnd) {
            if (this.previous.type === 'semicolon') return;

            switch (this.peek.type) {
                case 'class':
                case 'fun':
                case 'var':
                case 'for':
                case 'if':
                case 'while':
                case 'print':
                case 'return':
                    return;
            }

            this.advance();
        }
    }

    private advance(): Token {
        if (!this.atEnd) {
            this.current++;
        }
        
        return this.previous;
    }

    private error(token: Token, message: string): SyntaxError {
        // parsingError(token, message);
        console.error(token, message);
        return new SyntaxError();
    }

    private check(tokenType: TokenType): boolean {
        if (this.atEnd) {
            return false;
        } else {
            return this.peek.type === tokenType;
        }
    }

    get atEnd() {
        return this.peek.type === 'eof';
    }

    get peek(): Token {
        return this.tokens[this.current];
    }

    get peekNext(): Token {
        return this.tokens[this.current + 1];
    }

    get previous(): Token {
        return this.tokens[this.current - 1];
    }
}