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
    tutorial0: _=>`
    Do you want to see the tutorial?<br>
    <button onclick="setPopup(POPUP.tutorial1())">Of course!</button><button onclick="removePopup();start()">Nah.</button>
    `,
    tutorial1: _=>`
    <h2>Tutorial</h2>

    This game isn't for beginners. Please play <a href='https://mrredshark77.github.io/Endless-Dice/'>RedShark's version</a> first. <br><br>
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
