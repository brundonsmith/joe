import { ReturnValue } from "./model"


let add = (a, b) => a + b

let mul = (a, b) => a * b

let sum1 = 12 add 5
let sum2 = add(12, 5)
let sum3 = add(12)(5)
let sum4 = 12 |> add(5)

let num = 12 |> add(2) |> mul(3)

let things = [ 4, 2, 7, 1 ]

let otherThings = things 
    |> filter(x => x % 2 == 0) 
    |> map(mul(2))

let obj = {
    foo: 12,
    bar: 5,
    stuff: 6
}

entries(obj) |> map(e => { [e.key]: e.value * 2 })

let obj2 = obj & { thing: 14 }

let merge(a, b) =>
    len(a) == 0 -> b
    len(b) == 0 -> a
    a[0] < b[0] -> [a[0]] + merge(a[1:], b)
                -> [b[0]] + merge(a, b[1:])

let mergesort(x) =>
    len(x) < 2 -> x
    ->  let h = len(x);
    merge(mergesort(x[:h]), mergesort(x[h:]))


// TODO: Figure out nested let syntax
// TODO: Figure out list indexing/slicing/comprehension


// Grammar
declaration = "let" + identifier + "=" + expression

identifier = [=*+-/^0-9a-z><]+

expression = 
    | "(" + expression + ")"
    | literal
    | funcallPrefix
    | funcallInfix
    | funcallUnary
    | conditional

literal =
    | [0-9]+(?:.[0-9]+)
    | '"' + * + '"'
    | true | false
    | "[" + (expression + ", ")* + "]"
    | "{" + (identifier + ":" + expression + ", ")* + "}"
    | "(" + (identifier + ", ")* + ")" + "=>" + expression
    | identifier + "=>" + expression

funcallPrefix = expression + "(" + (expression + ", ")* + ")"
funcallInfix = expression + expression + expression
funcallUnary = expression + "|>" + expression
conditional = (expression + "->" + expression)* + "->" + expression