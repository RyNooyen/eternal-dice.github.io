const POPUP = {
    win: _=>`
    <h2>You have won this Round! (${data.round})</h2>
    Pick <b>ONE</b> of the following cards:<br>
    <div id="pick_cards"></div>
    `,
    lose: _=>`
    <h2>GAME OVER!</h2>
    You lost at Round ${data.round}!<br>
    <button onclick="tryAgain()">Try again?</button>
    `,
    passConfirm: _=>`
    Are you sure you want to give up your turn? You have unspent energy.<br>
    <button onclick="removePopup();pass()">YES</button><button onclick="removePopup()">NO</button>
    `,
    scrambler: _ =>`
    You unlocked the <b class="blue">Scrambler Dice</b>!<br>
    <button onclick="removePopup()">Okay!</button>
    `,
    poison: _ =>`
    You unlocked the <b class="purple">Poison Dice</b>!<br>
    <button onclick="removePopup()">Okay!</button>
    `,
    infohub: _=>`
    Welcome to the info hub!<br>
    Here you can read on how to play the game, and other things in it!<br><br>
    <button onclick="setPopup(POPUP.infobasic())">Important</button> <button onclick="setPopup(POPUP.infodice())">Dices</button><br>
    <button onclick="removePopup()">Exit</button>
    `,
    infobasic: _=>`
    This game isn't for beginners. Please play <a href='https://mrredshark77.github.io/Endless-Dice/'>RedShark's version</a> first.<br><br>
    All the cards have been changed, the total amount of cards currently is ${CARDS.length}.<br>
    At round 5, you will choose between the <span style="color: yellow">major</span> cards, you will only get to choose these once and they will impact your gameplay dramatically!<br><br>
    Minimum & maximum number of sides have changed to add a softcap-like value called progress.<br>
    For every 75 sides, the amount of progress to get a side increments.<br>
    For example, if you have 30 of a side, one progress is needed and if you have 75 of a side, two progress is needed.<br><br>
    You will unlock new dice as you go along, helping you fight against the enemy.<br><br>
    <button onclick="setPopup(POPUP.infohub())">Go Back</button>
    `,
    infodice: _=>`
    <b class="red">Damage Dice</b> - Deals damage to the enemy.<br>
    <b class="orange">Swap Dice</b> - Swaps all your dice with the enemy's dice. You have a 1 in 250 chance of getting this.<br>
    <b class="green">Heal Dice</b> - Gives yourself health.<br>
    <b class="blue">Scrambler Dice</b> - Changes all the dice around it. Unlocked at Round 10.<br>
    <b class="purple">Poison Dice</b> - Spreads across damage over dice usage. Unlocked at Round 20.<br>
    <br>
    <button onclick="setPopup(POPUP.infohub())">Go Back</button>
    `,
}

function setPopup(txt) {
    document.getElementById("conclusion").innerHTML = txt
    document.getElementById("conclusion").style.top = "50%"
}

function removePopup() {
    if (document.getElementById("conclusion").style.top == "50%") {
        document.getElementById("conclusion").style.top = "-50%"
    }
}
