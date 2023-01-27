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
    const otherButtons = document.querySelectorAll(`.merge-box-button:not(.btn-group-${mergeType})`)
    hideAll(otherButtons)

    // hide the other menu items
    const otherItems = document.querySelectorAll(`.select-menu-item:not(.js-merge-box-button-${mergeType})`)
    hideAll(otherItems)

    // hide dropdown caret
    const caretButton = document.querySelectorAll('.js-merge-method-menu-button')
    hideAll(caretButton)

    // select the menu item
    const selectedItem = document.getElementsByClassName(`js-merge-box-button-${mergeType}`)
    selectAll(selectedItem)

    // select round the merge button
    const mergebutton = document.querySelectorAll('.merge-box-button')
    addClassAll(mergebutton, 'rounded-right-2')
}

function hideAll(elements) {
    for (let element of elements) {
        element.style.display = "none"
    }
}

function selectAll(elements) {
    for (let element of elements) {
        element.click()
    }
}

function addClassAll(elements, cls) {
    for (let element of elements) {
        element.className = `${element.className} ${cls}`
    }
}
