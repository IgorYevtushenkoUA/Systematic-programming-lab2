import {checkBrackets} from "./brackets.js";

const MATH_OPERATION_PRIORITY = {
    'sin': 4,
    'cos': 4,
    '/': 3,
    '*': 3,
    '-': 2,
    '+': 2,
    '(': 1,
    ')': 1,
}

/***
 * check if item math operation like [/,*,-,+] or not
 * @param item
 */
const isMathOperation = (item) => {
    switch (item) {
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
    return !isMathOperation(item) && !isBrackets(item)
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
        } else {
            if (item === '(') {
                stack.push(item)
            } else if (item === ')') {
                while (stack[stack.length - 1] !== '(') {
                    current.push(stack.pop())
                }
                stack.pop()
                // todo add [ and ] for array
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
    checkForError(expr)

    let arithmeticExpresion = !isArithmeticType(expr) // to know count or not

    expr = normalizeExpression(expr)
    let current = transformExpressionByReversedPolandNotation(expr)
    let answer = arithmeticExpresion ? transformReversedPolandNotationToValue(current) : "CON NOT COUNT"
    return answer
}

console.log(expressionCalculator('56 * sin ( 1 + 1 )'))


/*
я хочу дещо уточнити стосовно 2 лаби із системок
нам потрібнно зробити польську нотацію
1) де буде провірятися на коректність вираз
1.1) кількість дужок
2) якщо арифметичний вираз - рахувати результат
3) якщо містить букви А,Б та інші - то просто вивести до польського виразу (хз чи коректно сформулював)
3) якщо є масив теж звести лише до фінального виду польської нотації


ОПЕРАЦІЇ
+
-
*
/
sin
cos
та інші за бажанням

Чи я все правильно сформулював, якщо десь помилився або щось забув, то  додайте та виправте мене будь ласка
 */
