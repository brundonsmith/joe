import { Node } from "./model.ts";


export default function transpile(ast: Node[]): string {
    return ast.map(process).join('\n');
}

function process(node: Node): string {
    switch(node.kind) {
        case 'declaration':
            return `var ${node.name.lexeme} = ${process(node.initializer)};`;
        case 'identifier':
            return node.name.lexeme;
        case 'grouping':
            return ` (${process(node.expression)}) `;
        case 'operator-identifier':
            return `OP['${node.name.lexeme}']`;
        case 'literal':
            return JSON.stringify(node.value);
        case 'function-literal':
            return `(${node.params.map(token => token.lexeme).join(') => (')}) => ${process(node.body)}`;
        case 'range-literal':
            return `new Array(${process(node.end)} - ${process(node.start)}).fill(null).map((_, index) => ${process(node.start)} + index)`;
        case 'array-literal':
            return `[ ${node.elements.map(process).join(', ')} ]`;
        case 'object-literal':
            return `{ ${node.entries.map(entry => `${process(entry.key)}: ${process(entry.value)}`).join(', ')} }`;
        case 'call':
            return `${process(node.func)}(${node.args.map(process).join(')(')})`;
        case 'conditional':
            return `${process(node.condition)} ? ${process(node.case1)} : ${process(node.case2)}`;
        default:
            return `/* unknown */`;
    }
}
