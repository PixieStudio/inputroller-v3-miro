miro.onReady(() => {
    diceLog()
    UI.displayOnLoad()
    setInterval(diceLog, 1000)
})

//_______________________
// Home
//_______________________
document.getElementById('goToPool').addEventListener('click', async () => {
    const pool = await getWidget(poolWidget())
    if (pool.length === 1) {
        await miro.board.viewport.zoomToObject(pool)
    } else {
        return miro.showErrorNotification("Input Roller n'est pas sur le board. Vous devez lancer les dés une première fois.")
    }
})

document.getElementById('clearPoolLog').addEventListener('click', async () => {
    const pool = await getWidget(poolWidget())
    if (pool.length === 1) {
        await miro.board.widgets.update({
            id: pool[0].id,
            metadata: {
                [APP_ID]: {
                    roll: 0,
                    type: 'pool'
                }
            }
        })
    } else {
        return miro.showErrorNotification("Input Roller n'est pas sur le board. Vous devez lancer les dés une première fois.")
    }
})



//_______________________
// Dice Roller
//_______________________

// Username Storage
storeInput('usernameC', 'keyup', 'irUsername')
storeInput('usernameF', 'keyup', 'irUsername')


// Dis/Advantage Storage
storeInput('advantageValue', 'keyup', 'irAdvantageValue')
storeInput('advantageValue', 'change', 'irAdvantageValue')
storeInput('disadvantageValue', 'keyup', 'irDisadvantageValue')
storeInput('disadvantageValue', 'change', 'irDisadvantageValue')
storeInput('explodeValue', 'keyup', 'irExplodeValue')
storeInput('explodeValue', 'change', 'irExplodeValue')


// Critical, Target, Difficulty Storage
storeSelect('critical', 'irCritical')
storeSelect('fumble', 'irFumble')
storeSelect('target', 'irTarget')
storeSelect('difficulty', 'irDifficulty')
storeInput('critical', 'keyup', 'irCritical', true)
storeInput('critical', 'change', 'irCritical', true)
storeInput('fumble', 'keyup', 'irFumble', true)
storeInput('fumble', 'change', 'irFumble', true)
storeInput('target', 'keyup', 'irTarget', true)
storeInput('target', 'change', 'irTarget', true)
storeInput('difficulty', 'keyup', 'irDifficulty', true)
storeInput('difficulty', 'change', 'irDifficulty', true)

// Fate Dice
storeInput('numberFateDice', 'keyup', 'irNumberFateDice')
storeInput('modFateDice', 'keyup', 'irModFateDice')
storeInput('numberFateDice', 'change', 'irNumberFateDice')
storeInput('modFateDice', 'change', 'irModFateDice')

// More Dice
document.getElementById('moreDice').addEventListener('click', () => {
    const diceSetContainer = document.getElementById('diceSetContainer')
    if (typeof localStorage.irDiceSet === 'undefined') {
        localStorage.irDiceSet = JSON.stringify([0])
    }
    let arrayDice = JSON.parse(localStorage.irDiceSet)
    arrayDice = arrayDice.sort((a, b) => b - a)
    const diceSetID = arrayDice[0] + 1
    arrayDice.push(diceSetID)
    localStorage.irDiceSet = JSON.stringify(arrayDice)

    localStorage[`irDiceSetAdd${diceSetID}`] = JSON.stringify({
        id: diceSetID,
        number: "",
        type: "",
        mod: "",
        color: "black"
    })
    diceSetContainer.innerHTML += diceSetBoxHtml(diceSetID, '')
})

document.getElementById('diceSetContainer').addEventListener('DOMSubtreeModified', () => {
    const allDiceSet = document.querySelectorAll('.dice-set')
    if (allDiceSet.length > 0) {
        allDiceSet.forEach(diceSet => {
            const setID = diceSet.dataset.dicesetid
            document.querySelector(`#numberDice${setID}`).addEventListener('change', () => {
                storeDiceSet(setID)
            })
            document.querySelector(`#typeDice${setID}`).addEventListener('change', () => {
                storeDiceSet(setID)
            })
            document.querySelector(`#modDice${setID}`).addEventListener('change', () => {
                storeDiceSet(setID)
            })
        })
    }
})

// Remove diceset
document.getElementById('diceSetContainer').addEventListener('click', (e) => {
    deleteSet(e.target)
    storeColorAdd(e.target)
})

document.getElementById('rollClassicDice').addEventListener('click', async () => {
    //_____________________
    // Prepare Storage
    //_____________________
    const allDiceSet = document.querySelectorAll('.dice-set')
    const arrayDice = []
    // For Each dice Set
    allDiceSet.forEach(diceSet => {
        // Get ID
        const setID = diceSet.dataset.dicesetid
        // Get input value
        const number = document.querySelector(`#numberDice${setID}`).value
        const type = document.querySelector(`#typeDice${setID}`).value
        const mod = document.querySelector(`#modDice${setID}`).value
        // Get color
        let color
        const btnclr = document.querySelectorAll(`.btn-dice-color${setID}`)
        btnclr.forEach(btn => {
            if (btn.classList.contains('focus')) {
                color = btn.dataset.color
            }
        })
        // Store Dice Set
        if (localStorage[`irDiceSetAdd${setID}`]) {
            let storeDice = JSON.parse(localStorage[`irDiceSetAdd${setID}`])
            storeDice.number = number
            storeDice.type = type
            storeDice.mod = mod
            localStorage[`irDiceSetAdd${setID}`] = JSON.stringify(storeDice)
        } else {
            localStorage[`irDiceSetAdd${setID}`] = JSON.stringify({
                id: setID,
                number: number,
                type: type,
                mod: mod,
                color: color
            })
        }
        const text = `${number}d${type}+${mod}|${color}`
        arrayDice.push(text)
    })
    //_____________________
    // Parse Storage
    //_____________________
    const rollValue = await verifClassicRoll()
    if (typeof rollValue === 'string') {
        // Parse results
        const result = parseClassicRoll(rollValue)
        const hiddenRollCheck = document.getElementById('hiddenRoll')
        const postItCheck = document.querySelector('#postIt')
        if (hiddenRollCheck.checked == true) {
            // LocalStorage
            hiddenRoll(result)
        } else {
            if (postItCheck.checked === true) {
                const resultTxt = parsePostIt(result)
                const viewport = await miro.board.viewport.get();
                // const viewport = await miro.board.viewport.getViewport();
                const x = viewport.x + (viewport.width / 2);
                const y = viewport.y + (viewport.height / 2);
                //Sticker color
                const stickerYellow = '#fff9b1';
                const stickerBlue = '#a6ccf5';
                //Sticker
                let selectSticker = await getWidget(stickerGet(localStorage.irUsername))
                if (selectSticker.length > 0) {
                    for (i = 0; selectSticker.length > i; i++) {
                        let stickerId = selectSticker[i].id
                        //Sticker color
                        let selStickerStyle = selectSticker[i].style
                        let stickerColor
                        if (selStickerStyle.stickerBackgroundColor == stickerYellow) {
                            stickerColor = stickerBlue
                        } else {
                            stickerColor = stickerYellow
                        }
                        await miro.board.widgets.update({
                            id: stickerId,
                            x: selectSticker[i].x,
                            y: selectSticker[i].y,
                            scale: selectSticker[i].scale,
                            style: {
                                stickerType: 0,
                                textAlign: 'c',
                                stickerBackgroundColor: stickerColor
                            },
                            text: resultTxt
                        })
                    }
                } else {
                    await miro.board.widgets.create({
                        type: 'sticker',
                        x: x,
                        y: y,
                        text: resultTxt,
                        scale: 2.5,
                        style: {
                            stickerType: 0,
                            textAlign: 'c'
                        },
                        metadata: {
                            [APP_ID]:
                            {
                                user: localStorage.irUsername
                            }
                        }
                    })
                }
            }
            // Fill Piscine
            dicePool(result)
        }
        // Switch Page
        UI.displayPage('results')
    }

})

document.getElementById('rollFateDice').addEventListener('click', async () => {
    //_____________________
    // Prepare Storage
    //_____________________
    // Get input value
    const number = document.getElementById('numberFateDice').value
    const mod = document.getElementById('modFateDice').value

    localStorage.irNumberFateDice = number
    localStorage.irModFateDice = mod

    //_____________________
    // Parse Storage
    //_____________________
    const rollValue = await verifFateRoll()
    if (typeof rollValue === 'string') {
        // Parse results
        const result = parseFateRoll(rollValue)
        const postItCheckFate = document.querySelector('#fateSticker')
        // Fill Piscine
        if (postItCheckFate.checked === true) {
            const resultTxt = parsePostItFate(result)
            const viewport = await miro.board.viewport.get();
            // const viewport = await miro.board.viewport.getViewport();
            const x = viewport.x + (viewport.width / 2);
            const y = viewport.y + (viewport.height / 2);
            //Sticker color
            const stickerYellow = '#fff9b1';
            const stickerBlue = '#a6ccf5';
            //Sticker
            let selectSticker = await getWidget(stickerGet(localStorage.irUsername))
            if (selectSticker.length > 0) {
                for (i = 0; selectSticker.length > i; i++) {
                    let stickerId = selectSticker[i].id
                    //Sticker color
                    let selStickerStyle = selectSticker[i].style
                    let stickerColor
                    if (selStickerStyle.stickerBackgroundColor == stickerYellow) {
                        stickerColor = stickerBlue
                    } else {
                        stickerColor = stickerYellow
                    }
                    await miro.board.widgets.update({
                        id: stickerId,
                        x: selectSticker[i].x,
                        y: selectSticker[i].y,
                        scale: selectSticker[i].scale,
                        style: {
                            stickerType: 0,
                            textAlign: 'c',
                            stickerBackgroundColor: stickerColor
                        },
                        text: resultTxt
                    })
                }
            } else {
                await miro.board.widgets.create({
                    type: 'sticker',
                    x: x,
                    y: y,
                    text: resultTxt,
                    scale: 2.5,
                    style: {
                        stickerType: 0,
                        textAlign: 'c'
                    },
                    metadata: {
                        [APP_ID]:
                        {
                            user: localStorage.irUsername
                        }
                    }
                })
            }
        }
        dicePool(result)
        // Switch Page
        UI.displayPage('results')
    }

})
