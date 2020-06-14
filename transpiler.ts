import { Node } from "./model.ts";


export default function transpile(ast: Node[]): string {
    return ast.map(process).join('\n');
}

function process(node: Node): string {
    switch(node.kind) {
        case 'identifier':
            return node.name.lexeme;
        case 'operator-identifier':
            return `OPERATORS['${node.name.lexeme}']`;
        case 'literal':
            return JSON.stringify(node.value);
        case 'function-literal':
            return `(${node.params.map(token => token.lexeme).join(') => (')}) => ${process(node.body)}`;
        case 'declaration':
            return `const ${node.name.lexeme} = ${process(node.initializer)};`;
        case 'call':
            return `${process(node.func)}(${node.args.map(process).join(')(')})`;
        case 'conditional':
            return `${process(node.condition)} ? ${process(node.case1)} : ${process(node.case2)}`;
        default:
            return `/* unknown */`;
    }
}
