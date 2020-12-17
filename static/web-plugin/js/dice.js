const reParseChar = /[\/\|\_\}\]\(\)]/g
let status
const verifClassicRoll = async () => {
    // Verif Username
    if (typeof localStorage.irUsername === 'undefined') {
        return miro.showErrorNotification('Veuillez indiquer votre pseudo')
    }
    if (localStorage.irUsername === '') {
        return miro.showErrorNotification('Veuillez indiquer votre pseudo')
    }
    const reUsername = localStorage.irUsername.match(reParseChar)
    if (reUsername) {
        return miro.showErrorNotification('Pseudo : Caractère non autorisé')
    }
    // Dice Set Array Exist ?
    if (typeof localStorage.irDiceSet === 'undefined') {
        localStorage.irDiceSet = JSON.stringify([0])
        return miro.showErrorNotification('Veuillez ajouter un set de dés.')
    }

    let diceSetArray = JSON.parse(localStorage.irDiceSet)
    diceSetArray = diceSetArray.sort((a, b) => a - b)

    // Dice Set Array contains set
    if (diceSetArray.length < 2) {
        return miro.showErrorNotification('Veuillez ajouter un set de dés.')
    }

    let rollValue = "classic_"

    diceSetArray.shift()

    // Set default dice set
    let defaultDiceSet = JSON.parse(localStorage[`irDiceSetAdd${diceSetArray[0]}`])
    // Dice Set
    diceSetArray.forEach(id => {
        const storage = JSON.parse(localStorage[`irDiceSetAdd${id}`])
        let number, type, mod
        const color = storage.color

        // Format integer
        storage.number === "" ? number = 0 : number = Math.floor(storage.number)
        storage.type === "" ? type = 0 : type = Math.floor(storage.type)
        storage.mod === "" ? mod = 0 : mod = Math.floor(storage.mod)

        // Validates input dice
        if (number < 1) {
            status = false
            return miro.showErrorNotification('Veuillez indiquer un entier positif pour le nombre de dés.')
        }
        if (type < 1) {
            status = false
            return miro.showErrorNotification('Veuillez indiquer un entier positif pour le type de dés.')
        }
        if (rollValue !== "classic_") {
            rollValue += "|"
        }
        rollValue += `${number}(d)${type}(m)${mod}(c)${color}`
    })
    if (status === false) {
        return
    }
    rollValue += "]"

    //Critical
    if (localStorage.irCriticalSwitch === 'true') {
        rollValue += 'true['
        let irCrit = localStorage.irCritical, irFumble = localStorage.irFumble
        if (typeof irCrit === 'undefined') {
            return miro.showErrorNotification('Veuillez indiquer un entier positif pour la valeur Succès Critique.')
        }
        if (typeof irFumble === 'undefined') {
            return miro.showErrorNotification('Veuillez indiquer un entier positif pour la valeur Échec Critique.')
        }
        irCrit = JSON.parse(localStorage.irCritical)
        irFumble = JSON.parse(localStorage.irFumble)
        if (irCrit.value < 1) {
            return miro.showErrorNotification('Veuillez indiquer un entier positif pour la valeur Succès Critique.')
        }
        if (irFumble.value < 1) {
            return miro.showErrorNotification('Veuillez indiquer un entier positif pour la valeur Échec Critique.')
        }
        rollValue += `${irCrit.compare}/${irCrit.value}|${irFumble.compare}/${irFumble.value}`
    } else {
        rollValue += 'false['
    }
    rollValue += ']'

    // Explode
    if (localStorage.irExplodeSwitch === 'true') {
        rollValue += 'true['
        let irExplode = localStorage.irExplodeValue
        if (typeof irExplode === 'undefined') {
            return miro.showErrorNotification('Veuillez indiquer un entier positif pour la valeur Explosive.')
        }
        irExplode = Math.floor(irExplode)
        if (irExplode < 1) {
            return miro.showErrorNotification('Veuillez indiquer un entier positif pour la valeur Explosive.')
        }
        if (irExplode > parseInt(defaultDiceSet.type)) {
            return miro.showErrorNotification('La valeur est supérieure au type de dés par défaut.')
        }
        rollValue += `${irExplode}`
    } else {
        rollValue += 'false['
    }
    rollValue += ']'

    // Keep greater
    if (localStorage.irAdvantageSwitch === 'true') {
        rollValue += 'true['
        let irAdvantage = localStorage.irAdvantageValue
        if (typeof irAdvantage === 'undefined') {
            return miro.showErrorNotification('Veuillez indiquer un entier positif pour la valeur à conserver.')
        }
        irAdvantage = Math.floor(irAdvantage)
        if (irAdvantage < 1) {
            return miro.showErrorNotification('Veuillez indiquer un entier positif pour la valeur à conserver.')
        }
        if (irAdvantage > parseInt(defaultDiceSet.number)) {
            return miro.showErrorNotification('La valeur est supérieure au nombre de dés par défaut.')
        }
        if (irAdvantage == parseInt(defaultDiceSet.number)) {
            return miro.showErrorNotification('Vous ne pouvez pas conserver tous les dés.')
        }
        rollValue += `${irAdvantage}`
    } else {
        rollValue += 'false['
    }
    rollValue += ']'

    // Keep lesser
    if (localStorage.irDisadvantageSwitch === 'true') {
        rollValue += 'true['
        let irDisadvantage = localStorage.irDisadvantageValue
        if (typeof irDisadvantage === 'undefined') {
            return miro.showErrorNotification('Veuillez indiquer un entier positif pour la valeur à conserver.')
        }
        irDisadvantage = Math.floor(irDisadvantage)
        if (irDisadvantage < 1) {
            return miro.showErrorNotification('Veuillez indiquer un entier positif pour la valeur à conserver.')
        }
        if (irDisadvantage > parseInt(defaultDiceSet.number)) {
            return miro.showErrorNotification('La valeur est supérieure au nombre de dés par défaut.')
        }
        if (irDisadvantage == parseInt(defaultDiceSet.number)) {
            return miro.showErrorNotification('Vous ne pouvez pas conserver tous les dés.')
        }
        rollValue += `${irDisadvantage}`
    } else {
        rollValue += 'false['
    }
    rollValue += ']'

    //Target
    if (localStorage.irTargetSwitch === 'true') {
        rollValue += 'true['
        let irTarget = localStorage.irTarget
        if (typeof irTarget === 'undefined') {
            return miro.showErrorNotification('Veuillez indiquer un entier positif pour la valeur cible.')
        }
        irTarget = JSON.parse(localStorage.irTarget)
        if (parseInt(irTarget.value) < 1) {
            return miro.showErrorNotification('Veuillez indiquer un entier positif pour la valeur cible.')
        }
        if (parseInt(irTarget.value) > parseInt(defaultDiceSet.type)) {
            return miro.showErrorNotification('La valeur cible ne peut excéder la valeur maximale du dé.')
        }
        rollValue += `${irTarget.compare}/${irTarget.value}`
    } else {
        rollValue += 'false['
    }
    rollValue += ']'

    //Difficulty
    if (localStorage.irDifficultySwitch === 'true') {
        rollValue += 'true['
        let irDifficulty = localStorage.irDifficulty
        if (typeof irDifficulty === 'undefined') {
            return miro.showErrorNotification('Veuillez indiquer un entier positif pour la valeur cible.')
        }
        irDifficulty = JSON.parse(localStorage.irDifficulty)
        if (irDifficulty.value < 0) {
            return miro.showErrorNotification('Veuillez indiquer un entier positif pour la valeur cible.')
        }
        rollValue += `${irDifficulty.compare}/${irDifficulty.value}`
    } else {
        rollValue += 'false['
    }
    rollValue += ']'

    // Insert username
    rollValue += localStorage.irUsername + ']'

    // Take last value on pool
    let rollNumber
    let pool = await getWidget(poolWidget())
    if (pool.length === 1) {
        pool = pool[0]
        poolMeta = pool.metadata[APP_ID]
        rollNumber = poolMeta['roll'] + 1
    } else {
        rollNumber = 1
    }
    rollValue += rollNumber

    return rollValue
}

const verifFateRoll = async () => {
    // Verif Username
    if (typeof localStorage.irUsername === 'undefined') {
        return miro.showErrorNotification('Veuillez indiquer votre pseudo')
    }
    if (localStorage.irUsername === '') {
        return miro.showErrorNotification('Veuillez indiquer votre pseudo')
    }

    let rollValue = "fate_"
    let number, mod

    // Format integer
    localStorage.irNumberFateDice === "" ? number = 0 : number = Math.floor(localStorage.irNumberFateDice)
    localStorage.irModFateDice === "" ? mod = 0 : mod = Math.floor(localStorage.irModFateDice)

    // Validates input dice
    if (number < 1) {
        return miro.showErrorNotification('Veuillez indiquer un entier positif pour le nombre de dés.')
    }
    rollValue += `${number}(m)${mod}]`

    // Insert username
    rollValue += localStorage.irUsername + ']'

    // Take last value on pool
    let rollNumber
    let pool = await getWidget(poolWidget())
    if (pool.length === 1) {
        pool = pool[0]
        poolMeta = pool.metadata[APP_ID]
        rollNumber = poolMeta['roll'] + 1
    } else {
        rollNumber = 1
    }
    rollValue += rollNumber

    return rollValue
}
