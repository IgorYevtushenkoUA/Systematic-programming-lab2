const isCloseBrackets = (bracket, bracketsConfig) => {
    for (let i = 0; i < bracketsConfig.length; i++) {
        if (bracketsConfig[i][1] === bracket)
            return true
    }
    return false
}

const isOpenBrackets = (bracket, bracketsConfig) => {
    for (let i = 0; i < bracketsConfig.length; i++) {
        if (bracketsConfig[i][0] === bracket)
            return true
    }
    return false
}

const isBracketsCouple = (bracketsOpen, bracketsClose, bracketsConfig) => {
    if (!(isOpenBrackets(bracketsOpen, bracketsConfig) && isCloseBrackets(bracketsClose, bracketsConfig))) return false
    for (let i = 0; i < bracketsConfig.length; i++)
        if (bracketsConfig[i][0] === bracketsOpen && bracketsConfig[i][1] === bracketsClose)
            return true
    return false

}

function check(str, bracketsConfig) {
    let bracketsQueue = []

    for (let i = 0; i < str.length; i++) {
        if (bracketsQueue.length > 0 && str.charAt(i) === '|' && bracketsQueue[bracketsQueue.length - 1] === '|') {
            bracketsQueue.pop()
        } else if (str.charAt(i) === '{' || str.charAt(i) === '[' || str.charAt(i) === '(') {
            bracketsQueue.push(str.charAt(i))
        } else if ( isBracketsCouple(bracketsQueue[bracketsQueue.length - 1] , str.charAt(i) ,bracketsConfig)) {
            bracketsQueue.pop()
        } else {
            bracketsQueue.push(str.charAt(i))
        }
    }
    return bracketsQueue.length === 0
}

console.log(check('([[][][][]])', [['(', ')'], ['[', ']'], ['{', '}']]));
