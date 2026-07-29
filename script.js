const wizard = {
    name: 'wizard',
    health: 100,
    minHealth: 0,
    maxHealth: 100,
    mana: 100,
    minMana: 0,
    maxMana: 100,
    shield: 0,
    maxShield: 100,
    minShield: 0,
    atkdmg: 10,
    maxAtkDmg: 25,
    poisonDamage: 0,
    poisonTurns: 0,
    skipPoisonTick: 0,
    spells: {
        arcaneBlast(player, enemy) {
            if (gameOver) return;
            if (currentTurn === player && player.mana >= 40) {
                player.mana -= 40;
                handleDamage(30, enemy);
                resolveAction(player, enemy);
                battleLog.push(`${player.name} used arcane blast on ${enemy.name}`);
                renderBattleLog();
                closeSpellMenu(player);
                shiftTurn(enemy);
            }
        },
        curseOfDecay(player, enemy) {
            if (gameOver) return;
            if (currentTurn === player && player.mana >= 35) {
                player.mana -= 35;
                enemy.poisonDamage = 8;
                enemy.poisonTurns += 4;
                resolveAction(player, enemy);
                battleLog.push(`${player.name} used curse of decay on ${enemy.name}`);
                renderBattleLog();
                closeSpellMenu(player);
                shiftTurn(enemy);
            }
        },
        siphon(player, enemy) {
            if (gameOver) return;
            if (currentTurn === player && player.mana >= 45) {
                player.mana -= 45;
                player.health += 20;
                handleDamage(20, enemy);
                resolveAction(player, enemy);
                battleLog.push(`${player.name} used siphon on ${enemy.name}`);
                renderBattleLog();
                closeSpellMenu(player);
                shiftTurn(enemy);
            }
        },        
    }
}
const dragon = {
    name: 'dragon',
    health: 100,
    minHealth: 0,
    maxHealth: 100,
    mana: 100,
    minMana: 0,
    maxMana: 100,
    shield: 0,
    maxShield: 100,
    minShield: 0,
    atkdmg: 10,
    maxAtkDmg: 25,
    poisonDamage: 0,
    poisonTurns: 0,
    skipPoisonTick: 0,
    spells: {
        infernoBreath(player, enemy) {
            if (gameOver) return;
            if (currentTurn === player && player.mana >= 40) {
                player.mana -= 40;
                handleDamage(20, enemy);
                enemy.poisonDamage = 5;
                enemy.poisonTurns += 2;
                enemy.skipPoisonTick = 1;
                resolveAction(player, enemy);
                battleLog.push(`${player.name} used inferno breath on ${enemy.name}`);
                renderBattleLog();
                closeSpellMenu(player);
                shiftTurn(enemy);
            }
        },
        venomBite(player, enemy) {
            if (gameOver) return;
            if (currentTurn === player && player.mana >= 35) {
                player.mana -= 35;
                enemy.poisonDamage = 6;
                enemy.poisonTurns += 5;
                resolveAction(player, enemy);
                battleLog.push(`${player.name} used venom bite on ${enemy.name}`);
                renderBattleLog();
                closeSpellMenu(player);
                shiftTurn(enemy);
            }
        },
        scaleform(player,enemy) {
            if (gameOver) return;
            if (currentTurn === player && player.mana >= 45) {
                player.mana -= 45;
                player.shield += 50;
                resolveAction(player, enemy);
                battleLog.push(`${player.name} used scaleform`);
                renderBattleLog();
                closeSpellMenu(player);
                shiftTurn(enemy);
            }
        },
    }
}
const battleLog = [];
let gameOver = false;

let currentTurn = Math.floor(Math.random() * 2);
if (currentTurn === 0) {
    currentTurn = wizard;
} else {
    currentTurn = dragon;
}
updateBattleCursor();

function renderBattleLog() {
    document.querySelector('.js-battle-log').innerHTML = battleLog.join('<br>');
    if (battleLog.length > 16) {
        battleLog.splice(0, 1);
    }
}
function resolveAction(player, enemy) {
    handleMinMaxValues(player);
    handleMinMaxValues(enemy);
    updateStats(player);
    updateStats(enemy);
    checkGameResult();
}
function handleDamage(damage, enemy) {
    if (enemy.shield < 1) {
        enemy.health -= damage;
    } else {
        enemy.shield -= damage;
        if (enemy.shield < 0) {
            enemy.health -= -enemy.shield;
            enemy.shield = 0;
        }
    }
}
function startTurn(player) {
    player.mana += 10;
    if (player.skipPoisonTick < 1) {
        if (player.poisonTurns > 0) {
            handleDamage(player.poisonDamage, player);
            player.poisonTurns--;
        }
    } else {
        player.skipPoisonTick--;
    }
    handleMinMaxValues(player);
    updateStats(player);
    checkGameResult();
}
function openSpellMenu(player) {
    if (gameOver) return;
    const spellMenu = document.querySelector(`.js-spell-menu-${player.name}`);
    spellMenu.style.display = "inline-block";
    document.querySelector(`.js-openspellmenu-${player.name}`).outerHTML = 
    `<button onclick="closeSpellMenu(${player.name})" class="js-closespellmenu-${player.name} closespellmenubutt">BACK</button>`
}
function closeSpellMenu(player) {
    const spellMenu = document.querySelector(`.js-spell-menu-${player.name}`);
    spellMenu.style.display = "none";
    document.querySelector(`.js-closespellmenu-${player.name}`).outerHTML = 
    `<button onclick="openSpellMenu(${player.name})" class="js-openspellmenu-${player.name} openspellmenubutt">USE SPELL</button>`
}
function attackEnemy(player, enemy) {
    if (gameOver) return;
    if (currentTurn === player) {
        handleDamage(player.atkdmg, enemy);
        resolveAction(player, enemy);
        battleLog.push(`${player.name} attacked ${enemy.name} for ${player.atkdmg}`)
        renderBattleLog();
        shiftTurn(enemy);
    }
}
function updateStats(character) {
    document.querySelector(`.js-health-${character.name}`).value = character.health;
    document.querySelector(`.js-health-amount-${character.name}`).innerHTML = character.health;
    document.querySelector(`.js-shield-${character.name}`).value = character.shield;
    document.querySelector(`.js-shield-amount-${character.name}`).innerHTML = character.shield;
    document.querySelector(`.js-mana-${character.name}`).value = character.mana;
    document.querySelector(`.js-mana-amount-${character.name}`).innerHTML = character.mana;
}
function updateBattleCursor() {
    if (currentTurn === wizard) {
        document.querySelector('.js-battle-cursor-dragon').style.display = 'none';
        document.querySelector('.js-battle-cursor-wizard').style.display = 'inline-block';
    } else {
        document.querySelector('.js-battle-cursor-wizard').style.display = 'none';
        document.querySelector('.js-battle-cursor-dragon').style.display = 'inline-block';
    }
}
function upgradeWeapon(player, enemy) {
    if (gameOver) return;
    if (currentTurn === player && player.mana >= 20) {
        player.atkdmg += 3;
        player.mana -= 20;
        document.querySelector(`.js-atkbutt-${player.name}`).innerHTML = '+3';
        setTimeout(function() {
            document.querySelector(`.js-atkbutt-${player.name}`).innerHTML = 'ATTACK';
        }, 1000);
        updateStats(player);
        battleLog.push(`${player.name} upgraded weapon for 3`);
        renderBattleLog();
        shiftTurn(enemy);
    }
}
function checkGameResult() {
    if (dragon.health < 1) {
        document.querySelector('.js-game-result').innerHTML = 'WIZARD WINS!';
        gameOver = true;
    } else if (wizard.health < 1) {
        document.querySelector('.js-game-result').innerHTML = 'DRAGON WINS!';
        gameOver = true;
    }
}
function raiseShield(player, enemy) {
    if (gameOver) return;
    if (currentTurn === player && player.mana >= 20) {
        player.shield += 20;
        player.mana -= 20;
        handleMinMaxValues(player)
        updateStats(player);
        battleLog.push(`${player.name} raised shield for 20`);
        renderBattleLog();
        shiftTurn(enemy);
    }
}
function handleMinMaxValues(player) {
    if (player.shield > player.maxShield) {
        player.shield = player.maxShield;
    } else if (player.shield < player.minShield) {
        player.shield = player.minShield;
    }
    if (player.atkdmg > player.maxAtkDmg) {
        player.atkdmg = player.maxAtkDmg;
    }
    if (player.mana > player.maxMana) {
        player.mana = player.maxMana;
    } else if (player.mana < player.minMana) {
        player.mana = player.minMana;
    }
    if (player.health > player.maxHealth) {
        player.health = player.maxHealth;
    } else if (player.health < player.minHealth) {
        player.health = player.minHealth;
    }
}
function shiftTurn(enemy) {
    if (gameOver) return;
    currentTurn = enemy;
    startTurn(enemy);
    updateBattleCursor();
}
document.querySelectorAll('.js-actionbtn').forEach((button) => {
    button.addEventListener('click', () => {
        const player = button.dataset.player === 'wizard' ? wizard : dragon;
        const enemy = button.dataset.player === 'wizard' ? dragon : wizard;
        const action = button.dataset.action;

        if (action === 'attackEnemy') {
            attackEnemy(player, enemy);
        } else if (action === 'raiseShield') {
            raiseShield(player, enemy);
        } else if (action === 'openSpellMenu') {
            openSpellMenu(player);
        } else if (action === 'upgradeWeapon') {
            upgradeWeapon(player, enemy);
        } else {
            player.spells[action](player, enemy);
        }
    })
});