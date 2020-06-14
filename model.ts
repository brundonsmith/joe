

// AST
export type Declaration = {
    kind: 'declaration',
    name: Token,
    initializer: Expression,
}

export type Expression = 
    | Literal

export type Literal = {
    kind: 'literal',
    value: LiteralValue,
}

export type Call = {
    kind: 'call',
    func: Expression,
    args: Expression[],
    paren: Token,
}

export type Conditional = {
    kind: 'conditional',
    cases: Array<{
        condition: Expression,
        result: Expression,
    }>,
    defaultCase: Expression,
}



// Tokens
export type Token = {
    type: TokenType,
    lexeme: string,
    literal?: LiteralValue,
    line: number,
}

export const KEYWORDS = [
    ',',
    '(',
    ')',
    '{',
    '}',
    '[',
    ']',
    '.',
    ':',
    '=', // might be a problem with == function
    '//',
    '=>',
    '->',
    '|>',
    'let',
    'true',
    'false',
] as const;

export type TokenType = 
    | typeof KEYWORDS[number]

    | 'identifier' | 'string'| 'number'

    | 'eof';

export type LiteralValue = 
    | ((...args: LiteralValue[]) => LiteralValue)
    | [ LiteralValue ] 
    | { [key: string]: LiteralValue } 
    | number|string|boolean|null;
