const parseClassicResult = (rollValue, hidden) => {
    const infos = rollValue.split('_')
    const system = infos.shift()
    const username = infos.shift()
    const rollID = infos.shift()
    const results = infos.shift().split('}')
    const empty = results.pop()
    const setOne = results.shift()

    let textHtml = ''
    if (hidden) {
        textHtml += `
    <div class="card border-dark mb-3" id="hiddenResult" style="max-width: 20rem;">
    <div class="card-header pointer" onclick="removeEphemere()"><span class="title-set-white mr-2">[JET MASQUÉ - Éphémère]</span><span class="title-set-white">${username.toUpperCase()}</span></div>
    <div class="card-body card-body-result">
    <div class="dice-set-result">
    `
    } else {
        textHtml += `
    <div class="card border-dark mb-3" data-resultcontainer="results-container" id="resultContainer${rollID}" style="max-width: 20rem;">
    <div class="card-header"><span class="title-set-white mr-2">#${rollID}</span><span class="title-set-white">${username.toUpperCase()}</span></div>
    <div class="card-body card-body-result">
    <div class="dice-set-result">
    `
    }

    // Set One
    //false[]false[]false[]false[]false[]false[]
    const options = setOne.split(']')
    const sum = options.pop()
    const setDice = options.shift().split('/')
    const allDice = setDice.shift().split('|')
    const mod = setDice.shift()
    const diceRoll = setDice.shift()
    const color = setDice.shift()

    const explode = options.shift().split('[')
    const critical = options.shift().split('[')
    const advantage = options.shift().split('[')
    const disadvantage = options.shift().split('[')
    const targetNumber = options.shift().split('[')
    const difficulty = options.shift().split('[')

    textHtml += `<p><span class="title-set-${color}">${diceRoll}</span></p>`
    textHtml += `<p class="mb-2"><small class="text-link"><a href="#" onclick="showDiceOnBoard('${allDice}', '${color}')">Afficher chaque dé sur le board</a></small></p>`

    allDice.forEach(dice => {
        textHtml += `<button type="button" class="btn btn-dice-result btn-${color} mx-1 mb-1">${dice}</button>`
    })
    // Explode
    if (explode[0] === 'true') {
        const exp = explode[1].split('|')
        const target = exp.pop()
        if (exp[0] !== '') {
            textHtml += `<p class="target-failure">Explosion [${target}+]</p>`
            exp.forEach(dice => {
                textHtml += `<button type="button" class="btn btn-dice-result btn-${color} mx-1 mb-1">${dice}</button>`
            })
        }
    }
    // Sum unless keep
    if (advantage[0] === 'false' && disadvantage[0] === 'false') {
        const total = Math.floor(sum) + Math.floor(mod)
        textHtml += `<p><span class="mr-1">Total</span> <span class="title-set-white mr-1">${total}</span> [${sum} + ${mod}]</p>`
    }
    // Crit
    if (critical[0] === 'true') {
        const critType = critical[1].split('|')
        const crit = critType.shift().split('/')
        const fumble = critType.shift().split('/')

        if (crit[0] > 0) {
            textHtml += `<p class="target-success">${crit[0]} Succès Critique [${compareSymbols(crit[1])} ${crit[2]}]</p>`
        }
        if (fumble[0] > 0) {
            textHtml += `<p class="target-failure">${fumble[0]} Échecs Critique [${compareSymbols(fumble[1])} ${fumble[2]}]</p>`
        }
    }
    // Keep Great
    if (advantage[0] === 'true') {
        const adv = advantage[1].split('|')
        const sumK = adv.pop()
        textHtml += `<p>Dés Conservés [${adv.length} plus haut]</p>`
        adv.forEach(dice => {
            textHtml += `<button type="button" class="btn btn-dice-result btn-${color} mx-1 mb-1">${dice}</button>`
        })
        const totalGreat = Math.floor(sumK) + Math.floor(mod)
        textHtml += `<p><span class="mr-1">Total</span> <span class="title-set-white mr-1">${totalGreat}</span> [${sumK} + ${mod}]</p>`
    }
    // Keep Less
    if (disadvantage[0] === 'true') {
        const dadv = disadvantage[1].split('|')
        const sumK = dadv.pop()
        textHtml += `<p>Dés Conservés [${dadv.length} plus bas]</p>`
        dadv.forEach(dice => {
            textHtml += `<button type="button" class="btn btn-dice-result btn-${color} mx-1 mb-1">${dice}</button>`
        })
        const totalLess = Math.floor(sumK) + Math.floor(mod)
        textHtml += `<p><span class="mr-1">Total</span> <span class="title-set-white mr-1">${totalLess}</span> [${sumK} + ${mod}]</p>`
    }
    // Target Number
    if (targetNumber[0] === 'true') {
        const newTarget = targetNumber[1].split('/')

        if (newTarget[0] > 0) {
            textHtml += `<p class="target-success"><span class="title-set-green">${newTarget[0]}</span> Réussite(s) [${compareSymbols(newTarget[1])} ${newTarget[2]}]</p>`
        } else {
            textHtml += `<p class="target-failure">Aucune Réussite [${compareSymbols(newTarget[1])} ${newTarget[2]}]</p>`
        }
    }
    // Difficulty
    if (difficulty[0] === 'true') {
        const diff = difficulty[1].split('/')
        if (diff[0] === 'true') {
            textHtml += `<p class="target-success">Réussite du Test [${compareSymbols(diff[1])} ${diff[2]}]</p>`
        } else {
            textHtml += `<p class="target-failure">Échec du Test [${compareSymbols(diff[1])} ${diff[2]}]</p>`
        }
    }

    // Other Set
    textHtml += `</div>`
    results.forEach(box => {
        textHtml += `<div class="dice-set-result">`
        const sumDice = box.split(']')
        const sum = sumDice.pop()
        const setDice = sumDice.shift().split('/')
        const allDice = setDice.shift().split('|')
        const mod = setDice.shift()
        const diceRoll = setDice.shift()
        const color = setDice.shift()

        //Parser le type de lancer
        textHtml += `
            <p><span class="title-set-${color}">${diceRoll}</span></p>
        `
        textHtml += `<p class="mb-2"><small class="text-link"><a href="#" onclick="showDiceOnBoard('${allDice}', '${color}')">Afficher chaque dé sur le board</a></small></p>`
        allDice.forEach(dice => {
            textHtml += `<button type="button" class="btn btn-dice-result btn-${color} mx-1 mb-1">${dice}</button>
        `
        })
        const total = Math.floor(sum) + Math.floor(mod)
        textHtml += `<p><span class="mr-1">Total</span> <span class="title-set-white mr-1">${total}</span> [${sum} + ${mod}]</p>
        </div>`
    })
    //Card boby
    textHtml += `</div>`
    //container
    textHtml += `</div>`
    return textHtml

}


const parseFateResult = (resultValue) => {
    const systemRoll = resultValue.split('_')
    const rollBox = systemRoll[1].split(']')
    const allDice = rollBox[0].split('|')
    const mod = Math.floor(rollBox[1])
    const sumDice = Math.floor(rollBox[2])
    const username = rollBox[3]
    const rollNumber = rollBox[4]

    let textHtml = ''
    textHtml += `
        <div class="card border-dark mb-3" data-resultcontainer="results-container" id="resultContainer${rollNumber}" style="max-width: 20rem;">
            <div class="card-header"><span class="title-set-white mr-2">#${rollNumber}</span><span class="title-set-white">${username.toUpperCase()}</span></div>
            <div class="card-body card-body-result">
            <div class="dice-set-result">
            <p><span class="title-set-white">${allDice.length} dés FATE + ${mod}</span></p>
        `

    textHtml += `<p class="mb-2"><small class="text-link"><a href="#" onclick="showFateOnBoard('${allDice}')">Afficher chaque dé sur le board</a></small></p>`

    allDice.forEach(dice => {
        let fate
        if (dice == -1) {
            fate = '-'
        } else if (dice == 0) {
            fate = ' '
        } else if (dice == 1) {
            fate = '+'
        }
        textHtml += `<button type="button" class="btn btn-dice-result btn-black mx-1 mb-1">${fate}</button>`
    })

    const total = sumDice + mod
    textHtml += `<p><span class="mr-1">Total</span> <span class="title-set-white mr-1">${total}</span> [${sumDice} + ${mod}]</p>`

    textHtml += `</div>`
    textHtml += `</div>`
    return textHtml
}

const parsePostIt = (rollValue) => {
    const infos = rollValue.split('_')
    const system = infos.shift()
    const username = infos.shift()
    const rollID = infos.shift()
    const results = infos.shift().split('}')
    const empty = results.pop()
    const setOne = results.shift()

    let textHtml = ''

    textHtml += `${username}\n\n`

    // Set One
    //false[]false[]false[]false[]false[]false[]
    const options = setOne.split(']')
    const sum = options.pop()
    const setDice = options.shift().split('/')
    const allDice = setDice.shift().split('|')
    const mod = setDice.shift()
    const diceRoll = setDice.shift()
    const color = setDice.shift()

    const explode = options.shift().split('[')
    const critical = options.shift().split('[')
    const advantage = options.shift().split('[')
    const disadvantage = options.shift().split('[')
    const targetNumber = options.shift().split('[')
    const difficulty = options.shift().split('[')

    textHtml += `${colorFr(color)} ${diceRoll}\n`
    textHtml += allDice.join(' + ')
    textHtml += '\n'
    // Explode
    if (explode[0] === 'true') {
        const exp = explode[1].split('|')
        const target = exp.pop()
        if (exp[0] !== '') {
            textHtml += `\nExplosion [${target}+]\n`
            textHtml += exp.join(' + ')
        }
        textHtml += '\n\n'
    }
    // Sum unless keep
    if (advantage[0] === 'false' && disadvantage[0] === 'false') {
        const total = Math.floor(sum) + Math.floor(mod)
        textHtml += `Total : ${total}\n\n`
    }
    // Crit
    if (critical[0] === 'true') {
        const critType = critical[1].split('|')
        const crit = critType.shift().split('/')
        const fumble = critType.shift().split('/')

        if (crit[0] > 0) {
            textHtml += `${crit[0]} Succès Critique [${compareSymbols(crit[1])} ${crit[2]}]\n\n`
        }
        if (fumble[0] > 0) {
            textHtml += `${fumble[0]} Échecs Critique [${compareSymbols(fumble[1])} ${fumble[2]}]\n\n`
        }
    }
    // Keep Great
    if (advantage[0] === 'true') {
        const adv = advantage[1].split('|')
        const sumK = adv.pop()
        textHtml += `\nDés Conservés [${adv.length} plus haut]\n`
        textHtml += adv.join(' + ')
        textHtml += '\n\n'
        const totalGreat = Math.floor(sumK) + Math.floor(mod)
        textHtml += `Total : ${totalGreat}\n\n`
    }
    // Keep Less
    if (disadvantage[0] === 'true') {
        const dadv = disadvantage[1].split('|')
        const sumK = dadv.pop()
        textHtml += `\nDés Conservés [${dadv.length} plus bas]\n`
        textHtml += dadv.join(' + ')
        textHtml += '\n\n'
        const totalLess = Math.floor(sumK) + Math.floor(mod)
        textHtml += `Total : ${totalLess}\n\n`
    }
    // Target Number
    if (targetNumber[0] === 'true') {
        const newTarget = targetNumber[1].split('/')

        if (newTarget[0] > 0) {
            textHtml += `${newTarget[0]} Réussite(s) [${compareSymbols(newTarget[1])} ${newTarget[2]}]\n\n`
        } else {
            textHtml += `Aucune Réussite [${compareSymbols(newTarget[1])} ${newTarget[2]}]\n\n`
        }
    }
    // Difficulty
    if (difficulty[0] === 'true') {
        const diff = difficulty[1].split('/')
        if (diff[0] === 'true') {
            textHtml += `Réussite du Test [${compareSymbols(diff[1])} ${diff[2]}]\n\n`
        } else {
            textHtml += `Échec du Test [${compareSymbols(diff[1])} ${diff[2]}]\n\n`
        }
    }

    // Other Set
    results.forEach(box => {
        textHtml += `\n`
        const sumDice = box.split(']')
        const sum = sumDice.pop()
        const setDice = sumDice.shift().split('/')
        const allDice = setDice.shift().split('|')
        const mod = setDice.shift()
        const diceRoll = setDice.shift()
        const color = setDice.shift()

        //Parser le type de lancer
        textHtml += `${colorFr(color)} ${diceRoll}\n`
        textHtml += allDice.join(' + ')
        textHtml += '\n'
        const total = Math.floor(sum) + Math.floor(mod)
        textHtml += `Total : ${total}`
    })

    return textHtml

}

const parsePostItFate = (resultValue) => {
    const systemRoll = resultValue.split('_')
    const rollBox = systemRoll[1].split(']')
    const allDice = rollBox[0].split('|')
    const mod = Math.floor(rollBox[1])
    const sumDice = Math.floor(rollBox[2])
    const username = rollBox[3]
    const rollNumber = rollBox[4]

    let textHtml = ''
    textHtml += `${username}\n\n`
    textHtml += `${allDice.length} dés FATE + ${mod}\n\n`

    allDice.forEach(dice => {
        let fate
        if (dice == -1) {
            fate = '➖'
        } else if (dice == 0) {
            fate = '⬛'
        } else if (dice == 1) {
            fate = '➕'
        }
        textHtml += `${fate} `
    })

    const total = sumDice + mod
    textHtml += `\n\nTotal : ${total}`

    return textHtml
}
