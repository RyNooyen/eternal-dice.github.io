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
    Congratulations! You made it to round 10!<br>
    As a reward, you have now unlocked the scrambler dice!<br>
    Every turn it will change all the dice next to it, allowing for more possibilities!<br>
    <button onclick="removePopup()">Okay!</button>
    `,
    poison: _ =>`
    Well done on making it to round 20!<br>
    However, the enemy will start automatically gaining side progress!<br>
    To combat this, you have the new poison dice!<br>
    Poison dice can apply a poison effect to the enemy, and causes them to get damage dealt to them every time they use dice!<br>
    This will come in useful as the enemy AI will not use dice if the next usage would kill them from the poison.<br>
    <button onclick="removePopup()">Okay!</button>
    `,
    tutorial0: _=>`
    Do you want to see the tutorial? (There's <b>ALOT</b> of new things)<br>
    <button onclick="setPopup(POPUP.tutorial1())">Of course!</button><button onclick="removePopup();start()">Nah.</button>
    `,
    tutorial1: _=>`
    <h2>Tutorial</h2>

    This game isn't for beginners. Please play <a href='https://mrredshark77.github.io/Endless-Dice/'>RedShark's version</a> first.<br><br>
    All the cards have been changed, the total amount of cards currently is ${CARDS.length}.<br>
    At round 5, you will choose between the <span style="color: yellow">major</span> cards, you will only get to choose these once and they will impact your gameplay dramatically!<br><br>
    Minimum & maximum number of sides have changed to add a softcap-like value called progress.<br>
    For every 75 sides, the amount of progress to get a side increments.<br>
    For example, if you have 30 of a side, one progress is needed and if you have 75 of a side, two progress is needed.<br><br>
    You will unlock new dice as you go along, helping you fight against the enemy.<br><br>
    <button onclick="removePopup();start()">Okay!</button>
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
