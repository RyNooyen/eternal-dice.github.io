const newData = _=>{
    return {
        p_grid: {},
        e_grid: {},

        move: "player",
        enemyReady: false,
        end: false,
        scrambler: false,
        poison: false,

        round: 1,

        player: {
            pick: [0,0],
            pickStep: 0,
            product: 1,
            energyCos: 0,
            health: 100,
            energy: 10,
            maxEnergy: 10,

            poison: {
                active: false,
                damage: 0,
                times: 0,
                maxTimes: 6,
                mult: 1
            },

            mult: 1,
            crit: 0.15,

            min_s: 1,
            min_s_prog:0,
            max_s: 6,
            max_s_prog:0,

            cards: [],
        },

        enemy: {
            pick: [0,0],
            product: 1,
            energyCos: 0,
            health: 50,
            maxHealth: 50,
            energy: 0,
            maxEnergy: 10,

            poison: {
                active: false,
                damage: 0,
                times: 0,
                maxTimes: 6,
                mult: 1,
            },

            mult: 1,
            crit: 0.15,
            
            min_s: 1,
            min_s_prog:0,
            max_s: 6,
            max_s_prog:0,

            cards: [],
        },
    }
}

var data = newData()

var tmp = {
    av_p_slots: [11,12,13,14,15,21,22,23,24,25,31,32,33,34,35,41,42,43,44,45],
    av_e_slots: [11,12,13,14,15,21,22,23,24,25,31,32,33,34,35,41,42,43,44,45],
}

const stringToString = {
    p_grid: ["player","av_p_slots","p_dice"],
    e_grid: ["enemy","av_e_slots","e_dice"],
    player: ["p_grid","enemy"],
    enemy: ["e_grid","player"],
}

function randomInt(min,max) { return Math.floor(Math.random() * (max + 1 - min) + min) }

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

function nextRound() {
    data.round++
    data.enemy.maxHealth = Math.floor(data.enemy.maxHealth*(data.round>20?1.4:1.2))
    if (data.player.cards.includes("m2")) data.player.mult += data.round>20?1:0.25
    data.enemy.mult += data.round>20?1:0.25
    data.enemy.health = data.enemy.maxHealth
    data.e_grid = {}

    /*if (data.player.cards.includes("curse2")) {
        data.player.health = Math.floor(data.player.health*1.1)
        data.enemy.mult *= 1.05
    }*/
    
    resetTwo("player")
    resetTwo("enemy")

    data.move = "player"

    data.end = false

    if (Math.random() < (data.round > 20 ? 0.3 : 0.2) && data.round > 10) {
        pass()
    }

    if (data.round > 20) {
        data.enemy.min_s_prog += 1
        data.enemy.max_s_prog += randomInt(1,2)
    }

    document.getElementById("conclusion").style.top = "-50%"

    document.getElementById("enemy_div").style.transform = "translateX(0%)"
    updateHTML()
    updateAvSlots("p_grid")
    updateAvSlots("e_grid")
    updateGridDices("p_grid")
    updateGridDices("e_grid")

    if (data.round == 10) {
        setPopup(POPUP.scrambler())
        data.scrambler = true
    } else if (data.round == 20) {
        setPopup(POPUP.poison())
        data.poison = true
    }
}

function chooseCard(p,e) {
    if (!data.end) return

    data.player.cards.push(p)
    data.enemy.cards.push(e)

    CARDS[p][3]("player")
    CARDS[e][3]("enemy")

    nextRound()
}

function tpf(scramble=false) {
    if (!scramble && Math.random() < 1/4 /* make 1 in 250 after test */) return "swap"

    if (data.poison && !scramble) {
        var x = Math.random()*8/2
        if (x > 3.5) return 4
        return Math.floor(x)
    } else if ((data.poison && scramble) || data.scrambler && (!scramble)) {
        return Math.floor(Math.random()*7/2)
    }
    return Math.floor(Math.random()*3)
}

function scrambleDice(grid) {
    for (let y = 1; y <= 4; y++) for (let x = 1; x <= 5; x++) {
        var id = y*10+x
        var g = data[grid][id]

        if (g !== undefined) if (g.type == "scrambler") for (let yy = -1; yy <= 1; yy++) for (let xx = -1; xx <= 1; xx++) {
            var yyy = y+yy, xxx = x+xx
            if (!(yy == 0 && xx == 0) && yyy > 0 && yyy < 5 && xxx > 0 && xxx < 6) {
                var gg = data[grid][yyy*10+xxx]
                var gd = document.getElementById(grid+"_"+id).getBoundingClientRect()
                createTextPopupParticle("Scrambled!",gd.x+gd.width/2,gd.y+gd.height/2,true)
                if (gg !== undefined) if (gg.type !== "scrambler") {
                    var tp = tpf(true)
                    gg.type = ["normal","attack","heal","poison"][tp]
                    gg.energy = [1,2,2,3][tp]
                }
            }
        }
    }
}

function generateRandomCards() {
    var t = ["player","enemy"]
    var ac = [[],[]]
    var cs = document.getElementById("pick_cards")
    cs.innerHTML = ""
    
    for (i in t) {
        var ks = Object.keys(CARDS)

        for (j in ks) if (CARDS[ks[j]][2](t[i])) ac[i].push(ks[j])
    }

    for (let i = 0; i < 3; i++) {
        let [p,e] =  [ac[0][Math.floor(Math.random()*ac[0].length)],ac[1][Math.floor(Math.random()*ac[1].length)]]
        if (data.round == 5) {
            [p,e] = [Object.keys(CARDS).filter(x=>x.charAt()=="m")[Math.floor(Math.random()*5)],Object.keys(CARDS).find(x => x=="f1")]
        }
        let [cp,ce] = [CARDS[p],CARDS[e]]

        cs.innerHTML += `
        <div class="card table_center" onclick="chooseCard('${p}','${e}')">
            <div class="card_p">
                <span style="${cp[4]}">${cp[0]}<br>
                <span style="font-size: 18px">${cp[1](0)}</span>
            </div>
            <div class="card_e">
                <span style="${ce[4]}">${ce[0]}<br>
                <span style="font-size: 18px">${ce[1](1)}</span>
            </div>
        </div>
        `
    }
}

function clearCost() {
    if (tmp.av_p_slots.length < 20 && data.player.energy >= 3 && data.move == "player") {
        data.player.energy -= 3

        data.p_grid = {}
        updateAvSlots("p_grid")
        updateGridDices("p_grid")
    }
}

function pickDice(pos) {
    let g = data.p_grid[pos]

    if (!g || data.player.pick.includes(pos) || data.player.pickStep > 1 || data.end || data.move != "player") return

    data.player.pick[data.player.pickStep] = pos
    data.player.energyCos += g.energy
    data.player.pickStep++
    data.player.product *= g.value

    updateGridDices('p_grid')
}

function makeMove(move="player") {
    var d = data[move]
    var g = data[stringToString[move][0]]
    var od = data[stringToString[move][1]]

    var dh = document.getElementById(move+"_health").getBoundingClientRect()
    var oh = document.getElementById(stringToString[move][1]+"_health").getBoundingClientRect()

    if ((d.pickStep > 1 || move == "enemy") && d.energy >= d.energyCos) {
        d.energy -= d.energyCos

        if (d.cards.includes("e3") && Math.random() < .2) d.energy += 2

        var dices = [g[d.pick[0]],g[d.pick[1]]]
        var p = Math.floor(d.product*d.mult)
        var dmg = 0, heal = 0, psn = 0, crit = "", s = [dices[0].type,dices[1].type].includes("scrambler")?3:1
        if (data.player.cards.includes("m2") || d.cards.includes("m3") || Math.random() < d.crit) { 
            crit = "Critical! "
            p *= 2
        }
        g[d.pick[0]] = undefined
        g[d.pick[1]] = undefined

        for (x in dices) {
            var dice = dices[x]
            
            if (dice.type == "normal" && d.cards.includes("m4")) {
                dice.type = ["attack","heal"][Math.round(Math.random())]
            }

            if (dice.type == "attack") {
                od.health = Math.max(od.health-p,0)
                if (od.cards.includes("m1")) {
                    od.mult = Math.log10(od.health) + 1
                }
                dmg += p
            }
            else if (dice.type == "swap") {
                var deref = JSON.parse(JSON.stringify(data.p_grid))
                data.p_grid = data.e_grid
                data.e_grid = deref
            }
            else if (dice.type == "heal") {
                d.health += p
                if (d.cards.includes("m1")) {
                    d.mult = Math.log10(od.health) + 1
                }
                heal += p
            }
            else if (dice.type == "poison") {
                od.poison.active = true
                od.poison.times = d.poison.maxTimes
                od.poison.damage = Math.max(Math.floor(p/d.poison.maxTimes),1)
                /*if (d.cards.includes("p3")) {
                    od.poison.times -= 1
                    dmg += od.poison.damage
                    od.health = Math.max(od.health-od.poison.damage,0)
                }*/
            }
            else if (d.cards.includes("o2") && dice.type == "normal") {
                od.health = Math.max(od.health-Math.ceil(move=="player"?p/4:p/2),0)
                dmg += Math.ceil(move=="player"?p/4:p/2)
            }
        }

        if (dices[0].type == dices[1].type) {
            if (dices[0].type == "attack") {
                od.health = Math.max(od.health-p*s,0)
                dmg += p*s
            }
            else if (dices[0].type == "heal") {
                d.health += p*s
                heal += p*s
            }
            else if (dices[0].type == "poison") {
                od.poison.times *= 2
            }
        }

        if (d.poison.active == true) {
            psn += d.poison.damage
            d.health -= d.poison.damage
            d.poison.times -= 1
            if (d.poison.times == 0) { d.poison.active = false }
        }
        
        d.energyCos = 0
        d.pick = [0,0]
        d.pickStep = 0
        d.product = 1

        if (dmg > 0) {
            createTextPopupParticle(`<span class="red">${crit+"-"+format(dmg)}</span>`,oh.x+oh.width/2,oh.y)
        }
        if (heal > 0) {
            createTextPopupParticle(`<span class="green">${crit+"+"+format(heal)}</span>`,dh.x+dh.width/2,oh.y)
        }
        if (psn > 0) {
            createTextPopupParticle(`<span style="color: #90c">${"-"+format(psn)}</span>`,dh.x+dh.width/2,dh.y)
        }

        updateGridDices("p_grid")
        updateGridDices("e_grid")

        updateAvSlots("p_grid")
        updateAvSlots("e_grid")

        if (od.health <= 0 || d.health <= 0) {
            data.end = true
            setTimeout(conclusion,1000)
        }
    }
}

function pass() {
    if (data.move == "player" && !data.end) {
        data.move = "enemy"
        data.enemy.energy = data.enemy.maxEnergy

        scrambleDice("e_grid")

        resetOne("player")

        setTimeout(autoEnemyMove,1000)
        if (data.player.cards.includes("m3")) {
            data.enemy.health = Math.floor(data.enemy.maxHealth)
        }
    }
}

function resetOne(id) {
    data[id].energy = 0
    data[id].energyCos = 0
    data[id].pick = [0,0]
    data[id].pickStep = 0
    data[id].product = 1
    data[id].poison.active = false

    updateGridDices("p_grid")
    updateGridDices("e_grid")
}

function resetTwo(id) {
    data[id].energy = data[id].maxEnergy
    data[id].energyCos = 0
    data[id].pick = [0,0]
    data[id].pickStep = 0
    data[id].product = 1
    data[id].poison.active = false
}

function conclusion() {
    if (data.player.health <= 0) {
        setPopup(POPUP.lose())
        document.getElementById("player_div").style.transform = "translateX(-100%)"
    } else if (data.enemy.health <= 0) {
        setPopup(POPUP.win())
        generateRandomCards()
        document.getElementById("enemy_div").style.transform = "translateX(100%)"
    }

    updateHTML()
}

function updateHTML() {
    document.getElementById("round").innerHTML = "Round "+data.round
}

function tryAgain() {
    if (!data.end) return

    document.getElementById("conclusion").style.top = "-50%"
    document.getElementById("enemy_div").style.transform = "translateX(100%)"

    setTimeout(_=>{
        data = newData()

        document.getElementById("player_div").style.transform = "translateX(0%)"
        document.getElementById("enemy_div").style.transform = "translateX(0%)"
        updateHTML()
        updateAvSlots("p_grid")
        updateAvSlots("e_grid")
        updateGridDices("p_grid")
        updateGridDices("e_grid")
    },2000)
}

function autoEnemyMove() {
    if (data.enemyReady) {
        makeMove("enemy")

        data.enemyReady = false
    } else {
        var hd = []
        var gd = []
        var g = Object.keys(data.e_grid)
        var de = data.enemy, trueNoNormal = tmp.av_e_slots.length == 0
        for (let i in g) if (data.e_grid[g[i]]) {
            if (!trueNoNormal && data.e_grid[g[i]].type != "normal") trueNoNormal = true
            gd.push(data.e_grid[g[i]])
            hd.push(g[i])
        }

        var rgd = []
        if (hd.length >= 2 && trueNoNormal) {
            step = 1
            noCost = true
            rgd = shuffle(gd).slice(0,2)

            while ((rgd[0].type == "normal" && rgd[1].type == "normal" || tmp.av_e_slots.length == 0) && de.energy >= rgd[0].energy + rgd[1].energy) {
                rgd = shuffle(gd).slice(0,2)

                console.log(rgd[0].type, rgd[1].type)

                step++
                if (step >= 100) break
            }
        }

        if (de.energy > 0) {
            if ((data.enemy.health > data.enemy.poison.damage || !data.enemy.poison.active) && rgd.length > 0 ? hd.length >= 2 && de.energy >= rgd[0].energy + rgd[1].energy && trueNoNormal && (Math.random() < 0.75 || tmp.av_e_slots.length == 0) : false) {
                data.enemyReady = true

                de.pick = [rgd[0].pos,rgd[1].pos]
                de.energyCos = rgd[0].energy + rgd[1].energy
                de.product = rgd[0].value * rgd[1].value
            } else spawnCost("e_grid")
        } else {
            data.move = "player"
            data.player.energy = data.player.maxEnergy

            scrambleDice("p_grid")
    
            resetOne("enemy")
    
            return
        }
    }

    updateGridDices("p_grid")
    updateGridDices("e_grid")

    if (!data.end) setTimeout(autoEnemyMove,1000)
}

function updateAvSlots(id) {
    var a = []
    var d = data[id]
    for (let y = 1; y <= 4; y++) for (let x = 1; x <= 5; x++) if (!d[y*10+x]) a.push(y*10+x)
    tmp[stringToString[id][1]] = a
}

function createGridDices(id) {
    var grid = document.getElementById(id);
    var html = ""
    for (let y = 1; y <= 4; y++) for (let x = 1; x <= 5; x++) html += `<div class="grid-dice empty" id="${id}_${y}${x}" ${id != "e_grid" ? `onclick="pickDice(${y}${x})"` : ""}></div>`
    grid.innerHTML = html

    updateGridDices(id)
}

function clearPick() {
    data.player.energyCos = 0
    data.player.pick = [0,0]
    data.player.pickStep = 0
    data.player.product = 1

    updateGridDices("p_grid")
}

function updateGridDices(id) {
    var grid = data[id]
    var dd = stringToString[id][0]
    var d = data[dd]

    document.getElementById(dd+"_move").innerHTML = data.move == dd ? " (Move)" : ""

    if (dd == "player") {
        document.getElementById("player_proccess").style.display = data.player.pickStep > 1 ? "inline" : "none"
        document.getElementById("player_proccess").innerHTML = `Make a Move, ${data.player.energyCos} Energy Cost`

        document.getElementById("player_clear").style.display = data.player.pickStep > 0 ? "inline" : "none"
        document.getElementById("player_pass").style.display = data.move == "player" ? "inline" : "none"
    }

    document.getElementById(dd+"_health").innerHTML = "Health: " + format(d.health) + (d.poison.active ? `<br><span style="color: #90c">(Poisoned: ${d.poison.damage} * ${d.poison.times})</span>` : "")
    document.getElementById(dd+"_energy").innerHTML = format(d.energy) + " / " + format(d.maxEnergy)
    document.getElementById(dd+"_mult").innerHTML = d.mult.toFixed(2)
    document.getElementById(dd+"_result").innerHTML = (d.pickStep > 1 || (id=="e_grid" && data.enemyReady)) ? format(Math.floor(d.product*d.mult)) : "?"


    for (let y = 1; y <= 4; y++) for (let x = 1; x <= 5; x++) {
        var i = y*10+x
        var g = document.getElementById(id+"_"+i)
        var gd = grid[i]

        g.innerHTML = "<div>"+(gd ? (gd.value > 9 ? gd.value : "") + `<span class="energy">${gd.energy}</span>` : "")+"</div>"
        g.className = "grid-dice "+(gd ? gd.type : "empty")

        if (d.pick.includes(i)) g.className += " picked"

        if (gd) {
            if (gd.type != "normal") g.innerHTML += `<img draggable="false" src='images/${gd.type}.png'>`
            if (gd.value < 10 && gd.type != "swap") g.innerHTML += `<img draggable="false" src='images/D${gd.value}.png'>`
        }
    }

    for (let i = 0; i < 2; i++) {
        var pdiv = document.getElementById(stringToString[id][2]+i)
        var pd = d.pick[i]

        pdiv.innerHTML = ""
        pdiv.className = "picked_dice" 

        if (pd > 0) {
            var gd = grid[pd]

            pdiv.innerHTML = "<div>"+(gd ? gd.value > 9 ? gd.value : "" : "")+"</div>"
            pdiv.className = "picked_dice "+(gd ? gd.type : "empty")

            if (gd.type != "normal") pdiv.innerHTML += `<img draggable="false" src='images/${gd.type}.png'>`
            if (gd.value < 10) pdiv.innerHTML += `<img draggable="false" src='images/D${gd.value}.png'>`
        }
    }
}

function spawnCost(id) {
    var d = data[stringToString[id][0]]

    if (d.energy - 1 >= 0 && tmp[stringToString[id][1]].length > 0 && (id == "p_grid" ? !data.end : true)) {
        d.energy -= 1

        spawnRandomDice(id,true)
    }
}

function spawnRandomDice(id,update=false) {
    var grid = data[id]
    var d = data[stringToString[id][0]]
    var s = tmp[stringToString[id][1]]
    var pos = s[Math.floor(Math.random()*s.length)]

    var tp = tpf()
    if (tp == 'swap') {
        grid[pos] = {pos: pos, value: 1, type: "swap", energy: 2}
    } else {
        grid[pos] = {pos: pos, value: randomInt(d.min_s,d.max_s), type: ["normal","attack","heal","scrambler","poison"][tp], energy: [1,2,2,2,3][tp]}
    }

    if (d.cards.includes('m5') && grid[pos].type == "normal") grid[pos].energy = 0


    updateAvSlots(id)
    if (update) updateGridDices(id)
}

function format(x) {
    return x.toFixed(0)
}

function start() {
    document.getElementById("main_menu").style.transform = "translateY(-100%)"
    document.getElementById("game").style.transform = "translateY(0%)"

    setTimeout(_=>{
        document.getElementById("player_div").style.transform = "translateX(0%)"
        document.getElementById("enemy_div").style.transform = "translateX(0%)"
    },1500)
}

function loadGame() {
    createGridDices("p_grid")
    createGridDices("e_grid")

    // start()
}
