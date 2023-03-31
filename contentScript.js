(() => {
    // TODO: Check how can we avoid duplicating this
    if (/^https:\/\/github\.com\/[\w-]+\/[\w-]+\/pull\//.test(location.href)) {
        newPRLoaded();
    }
})();

async function newPRLoaded() {
    const prStatus = document.querySelectorAll("[reviewable_state]")[0].innerText

    if (prStatus.includes("Open")) {
        const basePRMessage = document.getElementsByClassName("flex-auto min-width-0 mb-2")[0].children
        // Position 2 is target branch and position 5 is source branch
        const targetBranch = basePRMessage[2].children[0].children[0].innerText

        chrome.storage.sync.get(["branchNameRegex"]).then(({branchNameRegex = "main"}) => {
            console.log('restricting merge type for PR to' + `%c ${targetBranch}`, 'color:red')
            if (targetBranch.match(branchNameRegex)) {
                selectButton('merge')
            } else {
                selectButton('squash')
            }
        });
    }
}

function selectButton(mergeType) {
    mergeMessage = document.querySelector('.merge-message')
    if (!mergeMessage) {
        console.log('merge message not found. waiting to try again ...')
        return setTimeout(() => selectButton(mergeType), 100)
    }
    console.log('selecting merge type' + `%c ${mergeType}`, 'color:blue')
    // hide the other merge buttons
    hideAll(`.merge-box-button:not(.btn-group-${mergeType})`)

    // hide the other menu items
    hideAll(`.select-menu-item:not(.js-merge-box-button-${mergeType})`)

    // hide dropdown caret
    // hideAll('.js-merge-method-menu-button')
    hideAll('.select-menu-button')

    // select the menu item
    selectAll(`.js-merge-box-button-${mergeType}`)

    // select round the merge button
    addClassAll('.merge-box-button', 'rounded-right-2')
    return setTimeout(() => selectButton(mergeType), 1000)
}

function hideAll(query) {
    const elements = document.querySelectorAll(query)
    for (let element of elements) {
        element.style.display = "none"
    }
}

function selectAll(query) {
    elements = document.querySelectorAll(query)
    for (let element of elements) {
        element.click()
    }
}

function addClassAll(query, cls) {
    const elements = document.querySelectorAll(query)
    for (let element of elements) {
        element.className = `${element.className} ${cls}`
    }
}
