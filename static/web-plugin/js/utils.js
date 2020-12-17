// APP
const APP_ID = ''

// MIRO
const goToWidget = async (id) => {
    await miro.board.viewport.zoomToObject(id)
}

// DOM
const diceSetBoxHtml = (id, store) => {
    let number
    let type
    let mod
    if (store === '') {
        number = ''
        type = ''
        mod = ''
    } else {
        number = store['number']
        type = store['type']
        mod = store['mod']
    }
    const text = `
                <div class="form-group dice-set" id="diceSet${id}" data-dicesetid="${id}">
                    <label class="col-10 p-0 text-left control-label">Set de Dés ${id}</label><i class="col-2 p-0 text-right fas fa-times pointer close-set" data-diceset="${id}"></i>
                    <div class="form-group">
                        <div class="input-group mb-1">
                            <input type="number" class="form-control" aria-label="Number of dice ${id}" id="numberDice${id}" min="1" value="${number}">
                            <span class="input-group-text">d</span>
                            <input type="number" class="form-control" aria-label="Type of dice ${id}" id="typeDice${id}" min="1" value="${type}">
                            <span class="input-group-text">+</span>
                            <input type="number" class="form-control" aria-label="Modificator ${id}" id="modDice${id}" value="${mod}">
                        </div>
                        <button type="button" class="btn btn-dice btn-black mx-1 btn-dice-color${id} focus" data-color="black" data-diceset="${id}"></button>
                        <button type="button" class="btn btn-dice btn-white mx-1 btn-dice-color${id}" data-color="white" data-diceset="${id}"></button>
                        <button type="button" class="btn btn-dice btn-red mx-1 btn-dice-color${id}" data-color="red" data-diceset="${id}"></button>
                        <button type="button" class="btn btn-dice btn-green mx-1 btn-dice-color${id}" data-color="green" data-diceset="${id}"></button>
                        <button type="button" class="btn btn-dice btn-blue mx-1 btn-dice-color${id}" data-color="blue" data-diceset="${id}"></button>
                        <button type="button" class="btn btn-dice btn-yellow mx-1 btn-dice-color${id}" data-color="yellow" data-diceset="${id}"></button>
                    </div>
                </div>
                `
    return text
}

// STORAGE
const verifStorage = (type, storage) => {
    if (type === 'dice') {
        if (typeof localStorage[`irDiceSetAdd${storage}`] === 'undefined') {
            localStorage[`irDiceSetAdd${storage}`] = JSON.stringify({
                id: storage,
                number: document.querySelector(`#numberDice${storage}`).value,
                type: document.querySelector(`#typeDice${storage}`).value,
                mod: document.querySelector(`#modDice${storage}`).value,
                color: 'black'
            })
        }
    } else if (type === 'compare') {
        if (typeof localStorage[storage] === 'undefined') {
            localStorage[storage] = JSON.stringify({
                compare: "",
                value: ""
            })
        }
    }

}

const storeSelect = (name, storage) => {
    const selectOptions = document.getElementById(name + 'Options')
    selectOptions.addEventListener('change', () => {
        verifStorage('compare', storage)
        let parseObject = JSON.parse(localStorage[storage])
        parseObject.compare = selectOptions.options[selectOptions.selectedIndex].value
        parseObject.value = document.getElementById(name + 'Value').value
        localStorage[storage] = JSON.stringify(parseObject)
    })
}

// Not Used
const storeDice = (name, type, storage, key) => {
    document.getElementById(name).addEventListener(type, () => {
        verifStorage('dice', storage)
        let parseObject = JSON.parse(localStorage[storage])
        parseObject[key] = document.getElementById(name).value
        localStorage[storage] = JSON.stringify(parseObject)

    })
}

const storeDiceSet = (id) => {
    let number = document.querySelector(`#numberDice${id}`).value
    let type = document.querySelector(`#typeDice${id}`).value
    let mod = document.querySelector(`#modDice${id}`).value

    // Edit DOM prevent bug with More Dice Btn
    document.querySelector(`#numberDice${id}`).setAttribute('value', number)
    document.querySelector(`#typeDice${id}`).setAttribute('value', type)
    document.querySelector(`#modDice${id}`).setAttribute('value', mod)

    // localStorage
    let color
    const btnclr = document.querySelectorAll(`.btn-dice-color${id}`)
    btnclr.forEach(btn => {
        if (btn.classList.contains('focus')) {
            color = btn.dataset.color
        }
    })
    if (localStorage[`irDiceSetAdd${id}`]) {
        let storeDice = JSON.parse(localStorage[`irDiceSetAdd${id}`])
        storeDice.number = number
        storeDice.type = type
        storeDice.mod = mod
        localStorage[`irDiceSetAdd${id}`] = JSON.stringify(storeDice)
    } else {
        localStorage[`irDiceSetAdd${id}`] = JSON.stringify({
            id: setID,
            number: number,
            type: type,
            mod: mod,
            color: color
        })
    }
}

const storeColor = (key, value, storage) => {
    verifStorage('dice', storage)
    let parseObject = JSON.parse(localStorage[`irDiceSetAdd${storage}`])
    parseObject[key] = value
    localStorage[`irDiceSetAdd${storage}`] = JSON.stringify(parseObject)
}

const storeColorAdd = (el) => {
    if (el.classList.contains('btn-dice')) {
        const setid = el.dataset.diceset
        const btnclr = document.querySelectorAll(`.btn-dice-color${setid}`)
        btnclr.forEach(btn => {
            if (btn.classList.contains('focus')) {
                btn.classList.remove('focus')
            }
        })
        el.classList.add('focus')
        storeColor('color', el.dataset.color, setid)
    }
}

const storeInput = (name, type, storage, obj) => {
    if (obj && obj === true) {
        const value = name + 'Value'
        const selectOptions = document.getElementById(name + 'Options')
        document.getElementById(value).addEventListener(type, () => {
            verifStorage('compare', storage)
            let parseObject = JSON.parse(localStorage[storage])
            parseObject.compare = selectOptions.options[selectOptions.selectedIndex].value
            parseObject.value = document.getElementById(value).value
            localStorage[storage] = JSON.stringify(parseObject)
        })
    } else {
        document.getElementById(name).addEventListener(type, () => {
            localStorage[storage] = document.getElementById(name).value
        })
    }
}

// DELETE
const deleteSet = (el) => {
    if (el.classList.contains('close-set')) {
        const setid = el.dataset.diceset
        document.querySelector(`#diceSet${setid}`)
            .remove()
        const arraySet = JSON.parse(localStorage.irDiceSet)
        const indexSet = arraySet.indexOf(Math.floor(setid))
        if (indexSet > -1) {
            arraySet.splice(indexSet, 1)
        }
        localStorage.irDiceSet = JSON.stringify(arraySet)
        localStorage.removeItem(`irDiceSetAdd${setid}`)
    }
}

// PARSER

const compareSymbols = (el) => {
    let value
    if (el === 'gt') {
        value = '>'
    } else if (el === 'gteq') {
        value = '>='
    } else if (el === 'lt') {
        value = '<'
    } else if (el === 'lteq') {
        value = '<='
    }
    return value
}

const rollDice = (type) => {
    return Math.floor(Math.random() * Math.floor(type) + 1)
}

const explosion = (type, value, array) => {
    const arrayExplode = array
    const roll = rollDice(type)
    arrayExplode.push(roll)
    if (roll >= value) {
        explosion(type, value, arrayExplode)
    } else {
        return arrayExplode
    }
    return arrayExplode
}

// PISCINE
const poolWidget = () => {
    return {
        type: 'SHAPE',
        metadata: {
            [APP_ID]: {
                type: 'pool'
            }
        }
    }
}

const getWidget = (obj) => {
    return miro.board.widgets.get(obj)
}


function stickerGet(username) {
    return {
        type: 'sticker',
        metadata: {
            [APP_ID]: { user: username }
        }
    }
}

const createPool = async (brutRoll) => {
    let pool = await getWidget(poolWidget())
    if (pool.length === 0) {
        //Viewport
        const viewport = await miro.board.viewport.get();
        const x = viewport.x + (viewport.width / 2);
        const y = viewport.y + (viewport.height / 2);

        await miro.board.widgets.create({
            type: 'SHAPE',
            x: x,
            y: y,
            width: 300,
            height: 300,
            text: 'Input Roller',
            style: {
                shapeType: 3,
                backgroundColor: "transparent",
                borderColor: "#000000",
                borderWidth: 1,
                textAlign: "c",
                textAlignVertical: "m",
                bold: 1,
                fontSize: 64
            },
            metadata: {
                [APP_ID]: {
                    roll: 0,
                    type: 'pool'
                }
            }
        })
        return dicePool(brutRoll)
    }
}

const dicePool = async (brutRoll) => {
    let pool = await getWidget(poolWidget())
    if (pool.length === 1) {
        pool = pool[0]
        poolMeta = pool.metadata[APP_ID]
        poolMeta['roll'] += 1
        poolMeta[`${poolMeta['roll']}`] = brutRoll
        await miro.board.widgets.update({
            id: pool.id,
            metadata: {
                [APP_ID]: poolMeta
            }
        })
    } else {
        createPool(brutRoll)
    }
}

const hiddenRoll = async (brutRoll) => {
    localStorage.hiddenRoll = brutRoll
}

function removeEphemere() {
    if (localStorage.hiddenRoll) {
        hiddenBox = document.querySelector('#hiddenResult')
        hiddenBox.remove()
        localStorage.removeItem('hiddenRoll')
    }
}

const addDiv = (container, text) => {
    container.insertAdjacentHTML('afterbegin', text)
}

const diceLog = async () => {
    const parentResults = document.getElementById('results-container')
    let pool = await getWidget(poolWidget())
    if (pool.length === 1) {
        pool = pool[0]
        const poolMeta = pool.metadata[APP_ID]
        const countRoll = poolMeta['roll']
        if (countRoll === 0) {
            parentResults.innerHTML = ''
        } else {
            for (let i = 1; i <= countRoll; i++) {
                diceBoxID = document.querySelector(`#resultContainer${i}`)
                if (diceBoxID === null) {
                    if (poolMeta[i]) {
                        let result
                        const system = poolMeta[i].split('_')
                        if (system[0] === 'fate') {
                            result = parseFateResult(poolMeta[i])
                        } else if (system[0] === 'classic') {
                            result = parseClassicResult(poolMeta[i])
                        }
                        addDiv(parentResults, result)
                        if (parentResults.style.display === 'block') {
                            parentResults.scrollIntoView(true)
                        }
                    }
                }
            }
        }
    } else {
        parentResults.innerHTML = ''
    }
    if (localStorage.hiddenRoll) {
        hiddenBox = document.querySelector('#hiddenResult')
        result = parseClassicResult(localStorage.hiddenRoll, true)
        if (hiddenBox === null) {
            addDiv(parentResults, result)
        } else {
            hiddenBox.remove()
            addDiv(parentResults, result)
        }
    }
}

// Show Dice On Board

async function showDiceOnBoard(allDice, verbColor) {
    let color = ''
    switch (verbColor) {
        case 'black':
            color = '#000000';
            break;
        case 'white':
            color = '#d4d4d4';
            break;
        case 'red':
            color = '#e02d2d';
            break;
        case 'green':
            color = '#279e27';
            break;
        case 'blue':
            color = '#11b4dd';
            break;
        case 'yellow':
            color = '#ddbe11';
            break;
    }
    diceArr = allDice.split(',')
    //Viewport
    const viewport = await miro.board.viewport.get()
    const x = viewport.x + (viewport.width / 2)
    const y = viewport.y + (viewport.height / 2)
    for (let i = 0; i < diceArr.length; i++) {
        miro.board.widgets.create({
            type: 'SHAPE',
            x: x + 65 * i,
            y: y,
            width: 55,
            height: 55,
            text: diceArr[i],
            style: {
                shapeType: 3,
                backgroundColor: color,
                borderColor: "transparent",
                textAlign: "c",
                textAlignVertical: "m",
                bold: 1,
                fontFamily: 10,
                textColor: "#ffffff",
                fontSize: 30
            }
        })
    }
}

async function showFateOnBoard(allDice) {
    dice = allDice.split(',')
    //Viewport
    const viewport = await miro.board.viewport.get()
    const x = viewport.x + (viewport.width / 2)
    const y = viewport.y + (viewport.height / 2)
    let fate
    for (let i = 0; i < dice.length; i++) {
        if (dice[i] == -1) {
            fate = '-'
        } else if (dice[i] == 0) {
            fate = ' '
        } else if (dice[i] == 1) {
            fate = '+'
        }
        miro.board.widgets.create({
            type: 'SHAPE',
            x: x + 65 * i,
            y: y,
            width: 55,
            height: 55,
            text: fate,
            style: {
                shapeType: 3,
                backgroundColor: '#000000',
                borderColor: "transparent",
                textAlign: "c",
                textAlignVertical: "m",
                bold: 1,
                fontFamily: 10,
                textColor: "#ffffff",
                fontSize: 30
            }
        })
    }
}

const colorFr = (verb) => {
    let color = ''
    switch (verb) {
        case 'black':
            color = '⬛';
            break;
        case 'white':
            color = '⬜';
            break;
        case 'red':
            color = '🟥';
            break;
        case 'green':
            color = '🟩';
            break;
        case 'blue':
            color = '🟦';
            break;
        case 'yellow':
            color = '🟨';
            break;
    }
    return color
}
