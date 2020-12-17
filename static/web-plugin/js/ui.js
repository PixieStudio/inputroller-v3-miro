class UI {
    static displayOnLoad() {
        if (localStorage.irLoad) {
            UI.displayPage(localStorage.irLoad)
        } else {
            localStorage.irLoad = 'home'
            UI.displayPage('home')
        }
    }

    static displayOnLoadQuick() {
        if (localStorage.irLoad) {
            if (localStorage.irLoad === 'results') {
                UI.displayPage('classic')
            } else {
                UI.displayPage(localStorage.irLoad)
            }
        } else {
            localStorage.irLoad = 'home'
            UI.displayPage('home')
        }
    }

    static quickDice() {
        //Post It
        if (localStorage.irPostIt === 'true') {
            document.getElementById('postIt').checked = true
        }
        //Set Switch
        if (localStorage.irAdvantageSwitch === 'true') {
            advantageSwitch.checked = true
            document.getElementById('advantageKeepDice').style.display = 'block'
        } else {
            advantageSwitch.checked = false
            document.getElementById('advantageKeepDice').style.display = 'none'
        }
        if (localStorage.irDisadvantageSwitch === 'true') {
            disadvantageSwitch.checked = true
            document.getElementById('disadvantageKeepDice').style.display = 'block'
        } else {
            disadvantageSwitch.checked = false
            document.getElementById('disadvantageKeepDice').style.display = 'none'
        }
        if (localStorage.irTargetSwitch === 'true') {
            targetNumberSwitch.checked = true
            document.getElementById('targetNumber').style.display = 'block'
        } else {
            targetNumberSwitch.checked = false
            document.getElementById('targetNumber').style.display = 'none'
        }
        if (localStorage.irDifficultySwitch === 'true') {
            difficultyTestSwitch.checked = true
            document.getElementById('difficultyTest').style.display = 'block'
        } else {
            difficultyTestSwitch.checked = false
            document.getElementById('difficultyTest').style.display = 'none'
        }
        if (localStorage.irCriticalSwitch === 'true') {
            criticalSwitch.checked = true
            document.getElementById('criticalTarget').style.display = 'block'
        } else {
            criticalSwitch.checked = false
            document.getElementById('criticalTarget').style.display = 'none'
        }
        if (localStorage.irExplodeSwitch === 'true') {
            explodeSwitch.checked = true
            document.getElementById('explodeTarget').style.display = 'block'
        } else {
            explodeSwitch.checked = false
            document.getElementById('explodeTarget').style.display = 'none'
        }

        // Username
        localStorage.irUsername ? document.getElementById('usernameC').value = localStorage.irUsername : localStorage.irUsername = document.getElementById('usernameC').value
        if (typeof localStorage.irDiceSet === 'undefined') {
            localStorage.irDiceSet = JSON.stringify([0])
        }
        // More Dice
        let keySet = JSON.parse(localStorage.irDiceSet)
        keySet = keySet.sort((a, b) => a - b)
        keySet.shift()
        keySet.forEach(key => {
            const verifSet = document.querySelector(`#diceSet${key}`)
            if (verifSet === null) {
                const diceSetStore = JSON.parse(localStorage[`irDiceSetAdd${key}`])
                const diceSetID = diceSetStore.id
                const diceSetContainer = document.getElementById('diceSetContainer')
                diceSetContainer.innerHTML += diceSetBoxHtml(diceSetID, diceSetStore)
                const allBtnColor = document.querySelectorAll(`.btn-dice-color${diceSetID}`)
                allBtnColor.forEach(btn => {
                    if (btn.classList.contains('focus')) {
                        btn.classList.remove('focus')
                    }
                    if (btn.dataset.color === diceSetStore.color) {
                        btn.classList.add('focus')
                    }
                })
            }
        })
        // Options
        if (localStorage.irCritical) {
            const parseObject = JSON.parse(localStorage.irCritical)
            document.getElementById('criticalOptions').value = parseObject.compare
            document.getElementById('criticalValue').value = parseObject.value
        }
        if (localStorage.irFumble) {
            const parseObject = JSON.parse(localStorage.irFumble)
            document.getElementById('fumbleOptions').value = parseObject.compare
            document.getElementById('fumbleValue').value = parseObject.value
        }
        if (localStorage.irAdvantageValue) {
            document.getElementById('advantageValue').value = localStorage.irAdvantageValue
        }
        if (localStorage.irDisadvantageValue) {
            document.getElementById('disadvantageValue').value = localStorage.irDisadvantageValue
        }
        if (localStorage.irTarget) {
            const parseObject = JSON.parse(localStorage.irTarget)
            document.getElementById('targetOptions').value = parseObject.compare
            document.getElementById('targetValue').value = parseObject.value
        }
        if (localStorage.irDifficulty) {
            const parseObject = JSON.parse(localStorage.irDifficulty)
            document.getElementById('difficultyOptions').value = parseObject.compare
            document.getElementById('difficultyValue').value = parseObject.value
        }
        if (localStorage.irExplodeValue) {
            document.getElementById('explodeValue').value = localStorage.irExplodeValue
        }
    }

    static displayPage(page) {
        // Var Container
        const homeContainer = document.getElementById('home-container')
        const classicContainer = document.getElementById('classic-container')
        const fudgeContainer = document.getElementById('fudge-container')
        const resultsContainer = document.getElementById('results-container')
        const homeTab = document.getElementById('homeTab')
        const classicTab = document.getElementById('classicTab')
        const fudgeTab = document.getElementById('fudgeTab')
        const resultsTab = document.getElementById('resultsTab')

        // Var Switch
        const advantageSwitch = document.getElementById('advantageSwitch')
        const disadvantageSwitch = document.getElementById('disadvantageSwitch')
        const targetNumberSwitch = document.getElementById('targetNumberSwitch')
        const difficultyTestSwitch = document.getElementById('difficultyTestSwitch')
        const criticalSwitch = document.getElementById('criticalSwitch')
        const explodeSwitch = document.getElementById('explodeSwitch')

        if (page === 'home') {
            //Set Display Page
            homeContainer.style.display = 'block'
            classicContainer.style.display = 'none'
            fudgeContainer.style.display = 'none'
            resultsContainer.style.display = 'none'
            //Set Active Navbar Tab
            homeTab.classList = 'nav-link active'
            classicTab.classList = 'nav-link'
            fudgeTab.classList = 'nav-link'
            resultsTab.classList = 'nav-link'
            //Store
            localStorage.irLoad = 'home'
        } else if (page === 'classic') {
            //Set Display Page
            homeContainer.style.display = 'none'
            classicContainer.style.display = 'block'
            fudgeContainer.style.display = 'none'
            resultsContainer.style.display = 'none'
            //Set Active Navbar Tab
            homeTab.classList = 'nav-link'
            classicTab.classList = 'nav-link active'
            fudgeTab.classList = 'nav-link'
            resultsTab.classList = 'nav-link'
            //Store
            localStorage.irLoad = 'classic'
            //Post It
            if (localStorage.irPostIt === 'true') {
                document.getElementById('postIt').checked = true
            }
            //Set Switch
            if (localStorage.irAdvantageSwitch === 'true') {
                advantageSwitch.checked = true
                document.getElementById('advantageKeepDice').style.display = 'block'
            } else {
                advantageSwitch.checked = false
                document.getElementById('advantageKeepDice').style.display = 'none'
            }
            if (localStorage.irDisadvantageSwitch === 'true') {
                disadvantageSwitch.checked = true
                document.getElementById('disadvantageKeepDice').style.display = 'block'
            } else {
                disadvantageSwitch.checked = false
                document.getElementById('disadvantageKeepDice').style.display = 'none'
            }
            if (localStorage.irTargetSwitch === 'true') {
                targetNumberSwitch.checked = true
                document.getElementById('targetNumber').style.display = 'block'
            } else {
                targetNumberSwitch.checked = false
                document.getElementById('targetNumber').style.display = 'none'
            }
            if (localStorage.irDifficultySwitch === 'true') {
                difficultyTestSwitch.checked = true
                document.getElementById('difficultyTest').style.display = 'block'
            } else {
                difficultyTestSwitch.checked = false
                document.getElementById('difficultyTest').style.display = 'none'
            }
            if (localStorage.irCriticalSwitch === 'true') {
                criticalSwitch.checked = true
                document.getElementById('criticalTarget').style.display = 'block'
            } else {
                criticalSwitch.checked = false
                document.getElementById('criticalTarget').style.display = 'none'
            }
            if (localStorage.irExplodeSwitch === 'true') {
                explodeSwitch.checked = true
                document.getElementById('explodeTarget').style.display = 'block'
            } else {
                explodeSwitch.checked = false
                document.getElementById('explodeTarget').style.display = 'none'
            }

            // Username
            localStorage.irUsername ? document.getElementById('usernameC').value = localStorage.irUsername : localStorage.irUsername = document.getElementById('usernameC').value
            if (typeof localStorage.irDiceSet === 'undefined') {
                localStorage.irDiceSet = JSON.stringify([0])
            }
            // More Dice
            let keySet = JSON.parse(localStorage.irDiceSet)
            keySet = keySet.sort((a, b) => a - b)
            keySet.shift()
            keySet.forEach(key => {
                const verifSet = document.querySelector(`#diceSet${key}`)
                if (verifSet === null) {
                    const diceSetStore = JSON.parse(localStorage[`irDiceSetAdd${key}`])
                    const diceSetID = diceSetStore.id
                    const diceSetContainer = document.getElementById('diceSetContainer')
                    diceSetContainer.innerHTML += diceSetBoxHtml(diceSetID, diceSetStore)
                    const allBtnColor = document.querySelectorAll(`.btn-dice-color${diceSetID}`)
                    allBtnColor.forEach(btn => {
                        if (btn.classList.contains('focus')) {
                            btn.classList.remove('focus')
                        }
                        if (btn.dataset.color === diceSetStore.color) {
                            btn.classList.add('focus')
                        }
                    })
                }
            })
            // Options
            if (localStorage.irCritical) {
                const parseObject = JSON.parse(localStorage.irCritical)
                document.getElementById('criticalOptions').value = parseObject.compare
                document.getElementById('criticalValue').value = parseObject.value
            }
            if (localStorage.irFumble) {
                const parseObject = JSON.parse(localStorage.irFumble)
                document.getElementById('fumbleOptions').value = parseObject.compare
                document.getElementById('fumbleValue').value = parseObject.value
            }
            if (localStorage.irAdvantageValue) {
                document.getElementById('advantageValue').value = localStorage.irAdvantageValue
            }
            if (localStorage.irDisadvantageValue) {
                document.getElementById('disadvantageValue').value = localStorage.irDisadvantageValue
            }
            if (localStorage.irTarget) {
                const parseObject = JSON.parse(localStorage.irTarget)
                document.getElementById('targetOptions').value = parseObject.compare
                document.getElementById('targetValue').value = parseObject.value
            }
            if (localStorage.irDifficulty) {
                const parseObject = JSON.parse(localStorage.irDifficulty)
                document.getElementById('difficultyOptions').value = parseObject.compare
                document.getElementById('difficultyValue').value = parseObject.value
            }
            if (localStorage.irExplodeValue) {
                document.getElementById('explodeValue').value = localStorage.irExplodeValue
            }
        } else if (page === 'fudge') {
            //Set Display Page
            homeContainer.style.display = 'none'
            classicContainer.style.display = 'none'
            fudgeContainer.style.display = 'block'
            resultsContainer.style.display = 'none'
            //Set Active Navbar Tab
            homeTab.classList = 'nav-link'
            classicTab.classList = 'nav-link'
            fudgeTab.classList = 'nav-link active'
            resultsTab.classList = 'nav-link'
            //Store
            localStorage.irLoad = 'fudge'
            // Post It
            if (localStorage.irFateSticker === 'true') {
                document.getElementById('fateSticker').checked = true
            }
            // Username
            localStorage.irUsername ? document.getElementById('usernameF').value = localStorage.irUsername : localStorage.irUsername = document.getElementById('usernameF').value
            localStorage.irNumberFateDice ? document.getElementById('numberFateDice').value = localStorage.irNumberFateDice : localStorage.irNumberFateDice = document.getElementById('numberFateDice').value
            localStorage.irModFateDice ? document.getElementById('modFateDice').value = localStorage.irModFateDice : localStorage.irModFateDice = document.getElementById('modFateDice').value
        } else if (page === 'results') {
            //Set Display Page
            homeContainer.style.display = 'none'
            classicContainer.style.display = 'none'
            fudgeContainer.style.display = 'none'
            resultsContainer.style.display = 'block'
            //Set Active Navbar Tab
            homeTab.classList = 'nav-link'
            classicTab.classList = 'nav-link'
            fudgeTab.classList = 'nav-link'
            resultsTab.classList = 'nav-link active'
            //Store
            localStorage.irLoad = 'results'

        }
    }

    static switchDisplay(container) {
        if (container === 'advantageSwitch') {
            if (document.getElementById(container).checked) {
                document.getElementById(container).checked = false
                document.getElementById('advantageKeepDice').style.display = 'none'
                localStorage.irAdvantageSwitch = false
            } else {
                document.getElementById(container).checked = true
                document.getElementById('advantageKeepDice').style.display = 'block'
                document.getElementById('disadvantageSwitch').checked = false
                document.getElementById('disadvantageKeepDice').style.display = 'none'
                localStorage.irAdvantageSwitch = true
                localStorage.irDisadvantageSwitch = false
            }
        } else if (container === 'disadvantageSwitch') {
            if (document.getElementById(container).checked) {
                document.getElementById(container).checked = false
                document.getElementById('disadvantageKeepDice').style.display = 'none'
                localStorage.irDisadvantageSwitch = false
            } else {
                document.getElementById(container).checked = true
                document.getElementById('disadvantageKeepDice').style.display = 'block'
                document.getElementById('advantageSwitch').checked = false
                document.getElementById('advantageKeepDice').style.display = 'none'
                localStorage.irDisadvantageSwitch = true
                localStorage.irAdvantageSwitch = false
            }
        } else if (container === 'targetNumberSwitch') {
            if (document.getElementById(container).checked) {
                document.getElementById(container).checked = false
                document.getElementById('targetNumber').style.display = 'none'
                localStorage.irTargetSwitch = false
            } else {
                document.getElementById(container).checked = true
                document.getElementById('targetNumber').style.display = 'block'
                document.getElementById('difficultyTestSwitch').checked = false
                document.getElementById('difficultyTest').style.display = 'none'
                localStorage.irTargetSwitch = true
                localStorage.irDifficultySwitch = false
            }
        } else if (container === 'difficultyTestSwitch') {
            if (document.getElementById(container).checked) {
                document.getElementById(container).checked = false
                document.getElementById('difficultyTest').style.display = 'none'
                localStorage.irDifficultySwitch = false
            } else {
                document.getElementById(container).checked = true
                document.getElementById('difficultyTest').style.display = 'block'
                document.getElementById('targetNumberSwitch').checked = false
                document.getElementById('targetNumber').style.display = 'none'
                localStorage.irDifficultySwitch = true
                localStorage.irTargetSwitch = false
            }
        } else if (container === 'criticalSwitch') {
            if (document.getElementById(container).checked) {
                document.getElementById(container).checked = false
                document.getElementById('criticalTarget').style.display = 'none'
                localStorage.irCriticalSwitch = false
            } else {
                document.getElementById(container).checked = true
                document.getElementById('criticalTarget').style.display = 'block'
                localStorage.irCriticalSwitch = true
            }
        } else if (container === 'explodeSwitch') {
            if (document.getElementById(container).checked) {
                document.getElementById(container).checked = false
                document.getElementById('explodeTarget').style.display = 'none'
                localStorage.irExplodeSwitch = false
            } else {
                document.getElementById(container).checked = true
                document.getElementById('explodeTarget').style.display = 'block'
                localStorage.irExplodeSwitch = true
            }
        } else if (container === 'postIt') {
            if (document.getElementById(container).checked) {
                document.getElementById(container).checked = false
                localStorage.irPostIt = false
            } else {
                document.getElementById(container).checked = true
                localStorage.irPostIt = true
            }
        } else if (container === 'fateSticker') {
            if (document.getElementById(container).checked) {
                document.getElementById(container).checked = false
                localStorage.irFateSticker = false
            } else {
                document.getElementById(container).checked = true
                localStorage.irFateSticker = true
            }
        }
    }
}
