const CARDS = {
    m1: [
        "Healthy Multiplier",
        x=>`Your multiplier will always be set to log<sub>50</sub>(Health)`,
        x=>false,
        x=>{data[x].mult = (Math.log(data[x].health) / Math.log(50)) + 1},
        "color: yellow"
    ],
    m2: [
        "Critical Error",
        x=>`Both you and your enemy can only do crit attacks, but your multiplier increases like the enemy's`,
        x=>false,
        x=>{},
        "color: yellow"
    ],
    m3: [
        "Sub-immortality",
        x=>`Enemy is healed to max health every turn, but you're guaranteed to crit when dealing damage`,
        x=>false,
        x=>{},
        "color: yellow"
    ],
    m4: [
        "Natural Effects",
        x=>`When you use a normal dice, it will randomly choose between health and damage`,
        x=>false,
        x=>{},
        "color: yellow"
    ],
    m5: [
        "Eternal Waste",
        x=>`Normal dice will not use any energy`,
        x=>false,
        x=>{},
        "color: yellow"
    ],

    f1_1: [
        "Nothing",
        x=>`Literally nothing`,
        x=>!(x=="enemy"&&data.round>=10),
        x=>{}
    ],
    f2_1: [
        "Energy",
        x=>`Increase ${['your',"enemy's"][x]} max energy by <span class="green">2</span>`,
        x=>data[x].maxEnergy<=20,
        x=>{data[x].maxEnergy+=2}
    ],
    f2_2: [
        "More Energy",
        x=>`Increase ${['your',"enemy's"][x]} max energy by <span class="green">3</span>`,
        x=>data[x].maxEnergy>=20&&data[x].maxEnergy<=50,
        x=>{data[x].maxEnergy+=3}
    ],
    f2_3: [
        "Even More Energy",
        x=>`Increase ${['your',"enemy's"][x]} max energy by <span class="green">5</span>`,
        x=>data[x].maxEnergy>=30,
        x=>{data[x].maxEnergy+=5}
    ],
    f3_1: [
        "Minimum Incrementer",
        x=>`Increase ${['your',"enemy's"][x]} minimum number of side progress by <span class="green">1</span>`,
        x=>data[x].min_s<data[x].max_s&&data[x].min_s<10,
        x=>{
            data[x].min_s_prog+=1
            progCheck(x)
        }
    ],
    f3_2: [
        "Minimum Increaser",
        x=>`Increase ${['your',"enemy's"][x]} minimum number of side progress by <span class="green">2</span>`,
        x=>data[x].min_s<data[x].max_s&&data[x].min_s>=5&&data[x].min_s<35,
        x=>{
            data[x].min_s_prog+=2
            progCheck(x)
        }
    ],
    f3_3: [
        "Minimum Enlarger",
        x=>`Increase ${['your',"enemy's"][x]} minimum number of side progress by <span class="green">3</span>`,
        x=>data[x].min_s<data[x].max_s&&data[x].min_s>=30,
        x=>{
            data[x].min_s_prog+=3
            progCheck(x)
        }
    ],
    f4_1: [
        "Maximum Incrementer",
        x=>`Increase ${['your',"enemy's"][x]} maximum number of side progress by <span class="green">1</span>`,
        x=>data[x].max_s<12,
        x=>{
             data[x].max_s_prog+=1
            progCheck(x)
        }
    ],
    f4_2: [
        "Maximum Increaser",
        x=>`Increase ${['your',"enemy's"][x]} maximum number of side progress by <span class="green">2</span>`,
        x=>data[x].max_s>=8&&data[x].max_s<35,
        x=>{
            data[x].max_s_prog+=2
            progCheck(x)
        }
    ],
    f4_3: [
        "Maximum Enlarger",
        x=>`Increase ${['your',"enemy's"][x]} maximum number of side progress by <span class="green">3</span>`,
        x=>data[x].max_s>=30,
        x=>{
            data[x].max_s_prog+=3
            progCheck(x)
        }
    ],
    f5_1: [
        "Side Translation",
        x=>`Increase ${['your',"enemy's"][x]} minimum & maximum number of side progress by <b class='green'>1</b>`,
        x=>Math.random()>1/2,
        x=>{
            data[x].min_s_prog += 1
            data[x].max_s_prog += 1
            progCheck(x)
        }
    ],
    f5_2: [
        "Side Expansion",
        x=>`Increase ${['your',"enemy's"][x]} minimum & maximum number of side progress by <b class='green'>2</b>`,
        x=>Math.random()>1/2&&data[x].min_s>=20,
        x=>{
            data[x].min_s_prog += 2
            data[x].max_s_prog += 2
            progCheck(x)
        }
    ],
    f5_3: [
        "Side Overflow",
        x=>`Increase ${['your',"enemy's"][x]} minimum & maximum number of side progress by <b class='green'>4</b>`,
        x=>Math.random()>1/2&&data[x].min_s>=50,
        x=>{
            data[x].min_s_prog += 4
            data[x].max_s_prog += 4
            progCheck(x)
        }
    ],
    f6_1: [
        "Multiplier",
        x=>`Increase ${['your',"enemy's"][x]} multiplier by <b class='green'>0.3</b>`,
        x=>data[x].mult<=10&&!data[x].cards.includes("m1"),
        x=>{data[x].mult+=0.3}
    ],
    f6_2: [
        "Extra Multiplier",
        x=>`Increase ${['your',"enemy's"][x]} multiplier by <b class='green'>0.5</b>`,
        x=>data[x].mult>=4&&data[x].mult<=30&&!data[x].cards.includes("m1"),
        x=>{data[x].mult+=0.5}
    ],
    f6_3: [
        "Extreme Multiplier",
        x=>`Increase ${['your',"enemy's"][x]} multiplier by <b class='green'>1</b>`,
        x=>data[x].mult>=10&&!data[x].cards.includes("m1"),
        x=>{data[x].mult+=1}
    ],
    f7_1: [
        "Medicine",
        x=>`Multiplies ${['your',"enemy's"][x]} health by <b class='green'>1.1</b>`,
        x=>data[x].health > 50000,
        x=>{data[x].health *= 1.1; if (data[x].maxHealth) data[x].maxHealth *= 1.1}
    ],
    f7_2: [
        "Doctor",
        x=>`Multiplies ${['your',"enemy's"][x]} health by <b class='green'>1.2</b>`,
        x=>data[x].health > 1000,
        x=>{data[x].health *= 1.2; if (data[x].maxHealth) data[x].maxHealth *= 1.2}
    ],
    f7_3: [
        "Hospital",
        x=>`Multiplies ${['your',"enemy's"][x]} health by <b class='green'>1.3</b>`,
        x=>data[x].health <= 5000,
        x=>{data[x].health *= 1.3; if (data[x].maxHealth) data[x].maxHealth *= 1.3}
    ],

    g1: [
        "Transplant",
        x=>`Takes a third of ${["the enemy's",'your'][x]} health and gives it to ${['you',"the enemy"][x]}`,
        x=>Math.random()<1/4 && data[x].health > 1000,
        x=>{
            var a = x
            var b = x != 'player' ? 'player' : 'enemy'
            data[a].health += data[b].health/3
            if (a == 'enemy' && data[a].maxHealth < data[a].health) data[a].maxHealth = data[a].health
            data[b].health -= data[b].health/3
            if (b == 'enemy') data[b].maxHealth -= data[b].maxHealth/3
        },
        "color: lime"
    ],

    c1: [
        "Cursed Multiplier",
        x=>`Multiplies both of your side progress by <b class="green">2</b>, but your multiplier is divided by <b class="red">4</b>`,
        x=>x=="player"&&Math.random()<1/4,
        x=>{
            data[x].min_s_prog *= 2
            data[x].min_s_prog *= 2

            data[x].mult /= 4
        }
    ]
}
