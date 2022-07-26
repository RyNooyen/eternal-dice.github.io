const CARDS = {
    f1_1: [
        "Nothing",
        x=>`Kills your favorite anime characters`,
        x=>data.round<10,
        x=>{},
    ],
    f1_2: [
        "Nothinger",
        x=>`It's too late to run...`,
        x=>data.round>=10&&data.round<30,
        x=>{},
    ],
    f1_3: [
        "Nothingest",
        x=>`CONSOLE: IP successfully sent to Democratic Republic of Korea`,
        x=>data.round>=30,
        x=>{},
    ],
    f2_1: [
        "Energy",
        x=>`Increase max energy by <span class="green">+2</span>`,
        x=>data[x].maxEnergy<20,
        x=>{data[x].maxEnergy+=2},
    ],
    f2_2: [
        "Energy",
        x=>`Increase max energy by <span class="green">+3</span>`,
        x=>data[x].maxEnergy>=20&&data[x].maxEnergy<50,
        x=>{data[x].maxEnergy+=3},
    ],
    f2_3: [
        "Energy",
        x=>`Increase max energy by <span class="green">+5</span>`,
        x=>data[x].maxEnergy>=50,
        x=>{data[x].maxEnergy+=5},
    ],
}
