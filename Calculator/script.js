const buttons = document.querySelectorAll('button.functional')
const result = document.querySelector('#screen')
const scr = document.querySelector('#preview')
const ac = document.querySelector('#clear')
const del = document.querySelector('#delete')
const eq = document.querySelector('#equals')

const getCurrentInput = () => {
    return scr.innerHTML.toString()
}

const setCurrentInput = content => {
    if(content.length > 9) {
        if(content.includes('.')) scr.innerHTML = content.substring(0,11)
        else scr.innerHTML = content.substring(0,10)
    }
    else scr.innerHTML = content
}

const visualizeInput = (e) => {
    content = checkInput(e)
    setCurrentInput(`${scr.innerHTML}${content}`)
}

const setResult = content => {
    content = content.toString()
    if(content.length > 9) {
        if(parseFloat(content).toFixed(5) == Math.round(parseFloat(content) * 1000) / 1000) result.innerHTML = Math.round(parseFloat(content) * 1000) / 1000
        else if(content.includes('.')) {
            result.innerHTML = content.substring(0, 11)
        }
        else {
            result.innerHTML = content.substring(0, 10)
        }
    }
    else if(content.charAt(content.length - 1) == '.') {
        result.innerHTML =  content.substring(0, content.length - 1)
    }
    else result.innerHTML = content
}

const getLastResult = () => {
    if(result.innerHTML === 'ERROR') return 0
    else if(result.innerHTML.length > 8) return result.innerHTML.substring(0, 10)
    return result.innerHTML
}

const checkInput = (e) => {
    const input = e.target.innerHTML
    const currentInput = getCurrentInput()
    if(currentInput.length > 0) {
        if(input.match(/[÷|*|+|-|^|√]/)
        &&  currentInput.charAt(currentInput.length-1).match(/[÷|*|+|-|^|√]/)) return ''
        else if (currentInput.charAt(currentInput.length-2) == '-' && input == '-') return ''
        else if(input === '.') {
            if(inputToArray()[inputToArray().length - 1] === '') {
                if(inputToArray()[inputToArray().length - 2].includes('.')) return ''
            } else if(inputToArray()[inputToArray().length - 1].includes('.')) return ''
        }
        else if(input === '0' || input === '.') return input
    } 
    else if(!e.target.classList.contains('num') && e.target.id != 'root') {
        if(getLastResult() == 0 && input == '-') return '-'
        else return `${getLastResult()}${input}`
    }
    else if((input == '.')
        && currentInput.length < 1
        && !currentInput.includes('.')) return '0.'

    return e.target.innerHTML;
}

const inputToArray = () => {
    const currentInput = [...getCurrentInput()]
    let num = ''
    let arrInput = []
    let flag = 0

    currentInput.forEach(c => {
        if(c === '.' || !isNaN(c)) num += c
        else {
            arrInput.push(num)
            if(c !== '-') arrInput.push(c)
            if(currentInput[currentInput.length - 1] == '-'
            && currentInput[currentInput.length - 2] == '-') arrInput.push('-')
            if(c === '-' && flag === 0) {
                arrInput.push('+')
            }
            if(c == '√' || c == '^' || c == '*' || c == '÷' || c == '+' || c == '-') flag = 1
            else flag = 0
            num = ''
            if(c === '-') num += '-'
        }
    })
    if(num !== '') arrInput.push(num)

    let finalArr = []

    for(let i = 0; i < arrInput.length; i++) {
        if(!((arrInput[i - 1] === '^' || arrInput[i - 1] === '÷'
        || arrInput[i - 1] === '√' || arrInput[i - 1] === '*'
        || arrInput[i - 1] == '+' || arrInput[i - 1] == '-')
        && (arrInput[i] === ''))) finalArr.push(arrInput[i])
    }

    return finalArr
}

const evaluate = () => {
    let tokens = inputToArray()
    console.log(tokens)

    if(tokens.length === 2 && tokens[1] === '√') setResult(Math.sqrt(getLastResult()))
    else {

        const operatorPrecedence = [{'^': (a, b) => Math.pow(a,b)},
        {'√': (a, b) => (a === '') ? Math.sqrt(b) : parseFloat(a) * Math.sqrt(b)},
        {'*': (a, b) => parseFloat(a) * parseFloat(b),
        '÷': (a, b) => parseFloat(a) / parseFloat(b)},
        {'+': (a, b) => (a === '') ? parseFloat(b) : parseFloat(a) + parseFloat(b),
         '-': (a, b) => (a === '') ? parseFloat(b) : parseFloat(a) - parseFloat(b)}];

        let operator;
        for (const operators of operatorPrecedence) {
            const newTokens = [];
            for (const token of tokens) {
                if (token in operators) {
                    operator = operators[token];
                } else if (operator) {
                    if(typeof (newTokens[newTokens.length - 1]) === 'undefined') newTokens[newTokens.length - 1] = getLastResult()
                    if(newTokens) newTokens[newTokens.length - 1] = 
                    operator(newTokens[newTokens.length - 1], token);
                    operator = null;
                } else {
                    newTokens.push(token);
                }
            }
            tokens = newTokens;
        }
        if (tokens.length > 1) {
            setResult('ERROR');
            clearInput()
        } else {
            if(isNaN(tokens[0]) || tokens[0] == 'Infinity') setResult('ERROR')
            else setResult(tokens[0])
            clearInput()
        }
    }
}


const clearInput = () => {
    setCurrentInput('')
}

const clearAll = () => {
    clearInput()
    setResult('0')
} 

const deleteInput = () => {
    let input = getCurrentInput()
    setCurrentInput(input.substring(0, input.length - 1))
}

buttons.forEach( el => el.addEventListener('mouseup', visualizeInput))
ac.addEventListener('mouseup', clearAll)
del.addEventListener('mouseup', deleteInput)
eq.addEventListener('mouseup', evaluate)