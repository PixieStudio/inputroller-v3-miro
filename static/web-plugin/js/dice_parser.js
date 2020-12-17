const parseClassicRoll = (rollValue) => {
    const typeRoll = rollValue.split('_')
    const rollBox = typeRoll[1].split(']')
    const allDice = rollBox[0].split('|')
    const critical = rollBox[1].split('[')
    const explode = rollBox[2].split('[')
    const advantage = rollBox[3].split('[')
    const disadvantage = rollBox[4].split('[')
    const target = rollBox[5].split('[')
    const difficulty = rollBox[6].split('[')
    const username = rollBox[7]
    const rollNumber = rollBox[8]

    let parseResult = `classic_${username}_${rollNumber}_`

    allDice.forEach((setDice, index) => {
        const colorSplit = setDice.split('(c)')
        const modSplit = colorSplit[0].split('(m)')
        const typeSplit = modSplit[0].split('(d)')
        // Values
        const color = colorSplit[1]
        const mod = Math.floor(modSplit[1])
        const type = Math.floor(typeSplit[1])
        const number = Math.floor(typeSplit[0])

        let sumDice = 0
        const arrayDice = []
        // lancer les dés
        for (i = 0; i < number; i++) {
            const roll = rollDice(type)
            i === 0 ? parseResult += `${roll}` : parseResult += `|${roll}`
            sumDice += roll
            arrayDice.push(roll)
        }
        parseResult += `/${mod}/${number}d${type}+${mod}/${color}]`
        if (index === 0) {
            if (explode[0] === 'true') {
                parseResult += 'true['
                const arrayExplode = []
                const target = Math.floor(explode[1])
                arrayDice.forEach(dice => {
                    if (dice >= target) {
                        explosion(type, target, arrayExplode)
                    }
                })
                arrayExplode.forEach((exp, index) => {
                    index === 0 ? parseResult += `${exp}` : parseResult += `|${exp}`
                })
                const sumExplode = arrayExplode.reduce((a, b) => a + b, 0)
                sumDice += sumExplode
                arrayExplode.forEach(value => {
                    arrayDice.push(value)
                })
                parseResult += `|${target}]`
            } else {
                parseResult += 'false[]'
            }
        }


        // traiter les options si premier
        // Options if first element
        if (index === 0) {
            if (critical[0] === 'true') {
                parseResult += 'true['
                let sumCrit = 0
                let sumFumble = 0
                const critSplit = critical[1].split('|')
                const crit = critSplit[0].split('/')
                const fumble = critSplit[1].split('/')
                arrayDice.forEach(dice => {
                    //Check Crit
                    if (crit[0] === 'gt') {
                        if (dice > crit[1]) { sumCrit += 1 }
                    } else if (crit[0] === 'gteq') {
                        if (dice >= crit[1]) { sumCrit += 1 }
                    } else if (crit[0] === 'lt') {
                        if (dice < crit[1]) { sumCrit += 1 }
                    } else if (crit[0] === 'lteq') {
                        if (dice <= crit[1]) { sumCrit += 1 }
                    }
                    //Check Fumble
                    if (fumble[0] === 'gt') {
                        if (dice > fumble[1]) { sumFumble += 1 }
                    } else if (fumble[0] === 'gteq') {
                        if (dice >= fumble[1]) { sumFumble += 1 }
                    } else if (fumble[0] === 'lt') {
                        if (dice < fumble[1]) { sumFumble += 1 }
                    } else if (fumble[0] === 'lteq') {
                        if (dice <= fumble[1]) { sumFumble += 1 }
                    }
                })
                parseResult += `${sumCrit}/${crit[0]}/${crit[1]}|${sumFumble}/${fumble[0]}/${fumble[1]}]`

            } else {
                parseResult += 'false[]'
            }
            if (advantage[0] === 'true') {
                parseResult += 'true['
                sumDice = 0
                const arrayGreat = []
                const order = arrayDice.sort((a, b) => b - a)
                for (i = 0; i < advantage[1]; i++) {
                    arrayGreat.push(order[i])
                }
                arrayGreat.forEach((dice, index) => {
                    sumDice += dice
                    index === 0 ? parseResult += `${dice}` : parseResult += `|${dice}`
                })
                parseResult += `|${sumDice}`
                parseResult += ']'
                console.log(sumDice)
            } else {
                parseResult += 'false[]'
            }
            if (disadvantage[0] === 'true') {
                parseResult += 'true['
                sumDice = 0
                const arrayLess = []
                const order = arrayDice.sort((a, b) => a - b)
                for (i = 0; i < disadvantage[1]; i++) {
                    arrayLess.push(order[i])
                }
                arrayLess.forEach((dice, index) => {
                    sumDice += dice
                    index === 0 ? parseResult += `${dice}` : parseResult += `|${dice}`
                })
                parseResult += `|${sumDice}`
                parseResult += ']'
            } else {
                parseResult += 'false[]'
            }
            if (target[0] === 'true') {
                parseResult += 'true['
                let sumTarget = 0
                const targetSplit = target[1].split('|')
                const newTarget = targetSplit[0].split('/')
                arrayDice.forEach(dice => {
                    if (newTarget[0] === 'gt') {
                        if (dice > newTarget[1]) { sumTarget += 1 }
                    } else if (newTarget[0] === 'gteq') {
                        if (dice >= newTarget[1]) { sumTarget += 1 }
                    } else if (newTarget[0] === 'lt') {
                        if (dice < newTarget[1]) { sumTarget += 1 }
                    } else if (newTarget[0] === 'lteq') {
                        if (dice <= newTarget[1]) { sumTarget += 1 }
                    }
                })
                if (sumTarget > 0) {
                    parseResult += `${sumTarget}/${newTarget[0]}/${newTarget[1]}`
                } else {
                    parseResult += `0/${newTarget[0]}/${newTarget[1]}`
                }
                parseResult += ']'
            } else {
                parseResult += 'false[]'
            }
            if (difficulty[0] === 'true') {
                parseResult += 'true['
                const sumArrayDice = arrayDice.reduce((a, b) => a + b, 0)
                const difficultySplit = difficulty[1].split('|')
                const diff = difficultySplit[0].split('/')
                let diffResult
                if (diff[0] === 'gt') {
                    (sumArrayDice + mod) > diff[1] ? diffResult = true : diffResult = false
                } else if (diff[0] === 'gteq') {
                    (sumArrayDice + mod) >= diff[1] ? diffResult = true : diffResult = false
                } else if (diff[0] === 'lt') {
                    (sumArrayDice + mod) < diff[1] ? diffResult = true : diffResult = false
                } else if (diff[0] === 'lteq') {
                    (sumArrayDice + mod) <= diff[1] ? diffResult = true : diffResult = false
                }
                parseResult += `${diffResult}/${diff[0]}/${diff[1]}`
                parseResult += ']'
            } else {
                parseResult += 'false[]'
            }
        }
        parseResult += `${sumDice}}`
    })
    return parseResult
}

const parseFateRoll = (rollValue) => {
    const typeRoll = rollValue.split('_')
    const rollBox = typeRoll[1].split(']')
    const allDice = rollBox[0].split('(m)')
    const username = rollBox[1]
    const rollNumber = rollBox[2]

    let parseResult = 'fate_'

    const number = Math.floor(allDice[0])
    const mod = Math.floor(allDice[1])

    const arrayDice = []
    let sumDice = 0
    for (let i = 0; i < number; i++) {
        let roll = Math.floor(Math.random() * 3 + 1)
        if (roll === 1) {
            roll = -1
        } else if (roll === 2) {
            roll = 0
        } else if (roll === 3) {
            roll = 1
        }
        i === 0 ? parseResult += `${roll}` : parseResult += `|${roll}`
        sumDice += roll
        arrayDice.push(roll)
    }
    parseResult += `]${mod}]`

    parseResult += `${sumDice}]${username}]${rollNumber}`
    return parseResult
}
