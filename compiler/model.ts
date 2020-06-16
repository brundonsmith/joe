
// AST
export type Node =
    | Declaration
    | Expression



export type Declaration = {
    kind: 'declaration',
    name: Token,
    initializer: Expression,
}



export type Expression = 
    | Identifier
    | OperatorIdentifier
    | Literal
    | Call
    | Conditional

export type Identifier = {
    kind: 'identifier',
    name: Token
}

export type OperatorIdentifier = {
    kind: 'operator-identifier',
    name: Token
}

export type Literal =
    | PrimitiveLiteral
    | FunctionLiteral
    | RangeLiteral
    | ArrayLiteral
    | ObjectLiteral

export type PrimitiveLiteral = {
    kind: 'literal',
    value: LiteralValue,
}

export type FunctionLiteral = {
    kind: 'function-literal',
    params: Token[],
    body: Expression
}

export type RangeLiteral = {
    kind: 'range-literal',
    start: Expression,
    end: Expression,
}

export type ArrayLiteral = {
    kind: 'array-literal',
    elements: Expression[],
}

export type ObjectLiteral = {
    kind: 'object-literal',
    entries: Array<{
        key: Expression,
        value: Expression,
    }>
}


export type Call = {
    kind: 'call',
    func: Expression,
    args: Expression[],
}

export type Conditional = {
    kind: 'conditional',
    condition: Expression,
    case1: Expression,
    case2: Expression,
}



// Tokens
export type Token = {
    type: TokenType,
    lexeme: string,
    literal?: LiteralValue,
    line: number,
    whitespaceBefore: boolean,
}

export const OPERATORS = [
    '+',
    '-',
    '*',
    '/',

    '==',
    '!=',
    '>',
    '<',
    '>=',
    '<=',

    '&',
] as const;

export const KEYWORDS = [
    ',',
    '(',
    ')',
    '{',
    '}',
    '[',
    ']',
    '.',
    '..',
    ':',
    '=', // might be a problem with == function
    '//',
    '=>',
    '->',
    '|>',
    'let',
    'true',
    'false',
    'and',
    'or',
    'not',
    'undefined'
] as const;

export type TokenType = 
    | typeof KEYWORDS[number]

    | 'identifier' | 'string'| 'number'

    | 'eof';

export type LiteralValue = number|string|boolean|undefined;
