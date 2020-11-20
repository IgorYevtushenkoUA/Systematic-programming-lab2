import {checkBrackets} from "./brackets.js";

const MATH_OPERATION_PRIORITY = {
    'sin': 5,
    'cos': 5,
    '^': 4,
    '/': 3,
    '*': 3,
    '-': 2,
    '+': 2,
    '(': 1,
    ')': 1,
    '[': 1,
    ']': 1,
}

/***
 * check if item math operation like [/,*,-,+] or not
 * @param item
 */
const isMathOperation = (item) => {
    switch (item) {
        case 'sin':
            return true
        case 'cos':
            return true
        case '^':
            return true
        case '/':
            return true
        case '*':
            return true
        case '-':
            return true
        case '+':
            return true
        default:
            return false
    }
}
const isBrackets = (item) => {
    return (item === '(' || item === ')') || (item === '[' || item === ']')
}
const notBrackets = (item) => {
    return !isBrackets(item)
}

const isNumber = (item) => {
    return !isMathOperation(item)
        && !isBrackets(item)
        && !/[A-Za-z]/.test(item)
        && item !== ','
}

const isLetter = (item) => {
    return /[A-Za-z]/.test(item)
}

const isCommas = (item) => {
    return item === ','
}

/**
 * depend of math operation -> do math action
 * @param operation
 * @param x
 * @param y
 * @returns {number|*}
 */
const doOperation = (operation, x, y) => {
    switch (operation) {
        case 'sin':
            return Math.sin(Math.PI * (y / 180))
        case 'cos':
            return Math.cos(Math.PI * (y / 180))
        case '^':
            return (Math.pow(x, y))
        case '/':
            return (x / y)
        case '*':
            return (x * y)
        case '-':
            return (x - y)
        case '+':
            return (x + y)
    }
}

/***
 * this method normalize expression
 * - do trim()
 * - put spaces if expr without it
 * - delete unnecessary space (for instance double space)
 * @param expr
 */
const normalizeExpression = (expr) => {
    // del right and end spaces
    expr = expr.trim()
    //if expr has not spaces -> make it
    let exprCopy = ''
    for (let i = 0; i < expr.length; i++) {
        let item = expr.charAt(i)
        exprCopy += isMathOperation(item) ? ' ' + item + ' ' : item
    }
    expr = exprCopy
    // delete double spaces in the word center
    while (expr.includes('  '))
        expr = expr = expr.replace('  ', ' ')
    return expr
}
/**
 * check brackets in expr
 * @param expr
 */
const isBracketsCorrect = (expr) => {
    let onlyBrackets = expr.replace(/[^()\[\]]/g, "")
    if (!checkBrackets(onlyBrackets))
        throw new Error("ExpressionError: Brackets must be paired");
}

const divByZero = (expr) => {
    if (expr.includes('/ 0')) throw new Error("TypeError: Division by zero.")
}
/**
 * return true if expr incorrect else -> false
 * @param expr
 */
const checkForError = (expr) => {
    divByZero(expr)
    isBracketsCorrect(expr)
}

/**
 * using RPN (reversed poland notation)
 * to build special math string
 * @param expr
 * @returns {[]}
 */
const transformExpressionByReversedPolandNotation = (expr) => {
    let equation = expr.split(' ')
    let current = [], stack = []
    for (let i = 0; i < equation.length; i++) {
        let item = equation[i]
        if (isNumber(item)) {
            current.push(item)
        } else if (!isNumber(item) && isLetter(item)) {
            current.push(item)
            //todo
        } else {
            if (item === '(') {
                stack.push(item)
            } else if (item === ')') {
                while (stack[stack.length - 1] !== '(') {
                    current.push(stack.pop())
                }
                stack.pop()
                // todo add [ and ] for array
            } else if (item === '[') {
                stack.push("2")
                stack.push(item)
            } else if (item === ']') {
                while (stack[stack.length - 1] !== '[') {
                    current.push(stack.pop())
                }
                stack.pop()
                current.push(stack.pop())

            } else if (item === ',') {
                let stackCopy = stack.slice(0)
                while (Number.isNaN(parseInt(stackCopy[stackCopy.length - 1]))) {
                    stackCopy.pop()
                }
                stack[stackCopy.length-1] = 1 + parseInt(stack[stackCopy.length-1])

                while (stack[stack.length - 1] !== '[')
                    current.push(stack.pop())
                //todo
            } else if (stack.length === 0) {
                stack.push(item)
            } else if (MATH_OPERATION_PRIORITY[item] > MATH_OPERATION_PRIORITY[stack[stack.length - 1]]) {
                stack.push(item)
            } else if (MATH_OPERATION_PRIORITY[item] === MATH_OPERATION_PRIORITY[stack[stack.length - 1]]) {
                current.push(stack.pop())
                stack.push(item)
            } else if (MATH_OPERATION_PRIORITY[item] < MATH_OPERATION_PRIORITY[stack[stack.length - 1]]) {
                while (MATH_OPERATION_PRIORITY[item] <= MATH_OPERATION_PRIORITY[stack[stack.length - 1]]) {
                    current.push(stack.pop())
                }
                stack.push(item)
            }
        }
    }
    while (stack.length > 0)
        current.push(stack.pop())

    return current
}

/**
 * using current list (with RPN - reversed poland notation)
 * to calculate value by special math string
 * @param current
 * @returns {*}
 */
const transformReversedPolandNotationToValue = (current) => {
    let answer = []
    for (let i = 0; i < current.length; i++) {
        let item = current[i]
        if (isNumber(item)) {
            answer.push(item)
        } else {
            let y = parseFloat(answer.pop())
            let x = parseFloat(answer.pop())
            let res = doOperation(item, x, y)
            if (item === 'cos' || item === 'sin')
                answer.push(x)
            answer.push(res)
        }
    }
    return answer[0]
}

function isArithmeticType(expr) {
    let exprArr = expr.split(" "),
        checker = exprArr.filter(e => e != "").join(""),
        letters = /[A-Za-z]/i.test(exprArr.filter(item => item !== "cos" && item !== "sin").join("")),
        openBrackets = /[\[]/i.test(checker),
        closeBrackets = /[\]]/i.test(checker),
        comas = /[,]/i.test(checker)
    return comas || closeBrackets || openBrackets || letters
}

function expressionCalculator(expr) {
    try {
        checkForError(expr)

        let arithmeticExpresion = !isArithmeticType(expr) // to know count or not

        expr = normalizeExpression(expr)
        let current = transformExpressionByReversedPolandNotation(expr)
        let answer = arithmeticExpresion ? transformReversedPolandNotationToValue(current) : current.join(" ")
        return answer
    } catch (e) {
        return ("ERROR incorrect data")
    }


}

console.log(expressionCalculator('M * [ 8 , i - 4 , cos ( A ) , k * 4 ] ^ 6'));
// console.log(expressionCalculator(' 1 - 1'));
