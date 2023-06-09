class Game {
    constructor(player, machinePlayer, instructions, scoreBoard, joystick, restartGameButton, gameEndButton) { 
        this.player = player;
        this.machinePlayer = machinePlayer;
        this.instructions = instructions
        this.scoreBoard = scoreBoard
        this.joystick = joystick
        this.restartGameButton = restartGameButton
        this.rounds = 0;
        this.gameEndButton = gameEndButton
    }
    
    startGame() { 
        this.player.playUser();
        this.joystick.addEventListener('click', () => {
            this.machinePlayer.playMachine();
            this.winnerRound();
            this.exitGamebutton();
        })
    }

    changesOfWinnig(player1Decision, plaer2Decision) {
        return  (( player1Decision === "piedra🪨" && plaer2Decision === "tijera✂️") ||
        ( player1Decision === "tijera✂️" && plaer2Decision === "papel📋") ||
        ( player1Decision === "papel📋" && plaer2Decision === "piedra🪨"))

    }
    
    winnerRound() { 
        this.rounds ++; 
        if (this.changesOfWinnig(this.player.decision, this.machinePlayer.decision)) { 
            this.scoreBoard.messageForRoundWinner.innerText = this.player.pointForVictory() 
        } else if (this.changesOfWinnig(this.machinePlayer.decision, this.player.decision)) { 
            this.scoreBoard.messageForRoundWinner.innerText = this.machinePlayer.pointForVictory()
        } else { 
            this.scoreBoard.messageForRoundWinner.innerText = "¡Empate! 😱"
        }  
        if (this.rounds > 5) {
            this.checkGameWinner(5);
        };
        this.scoreBoard.showRoundResults()
    }

    checkGameWinner(max) { 
        if (this.player.points == max) { 
            this.instructions.innerText = "🔥 ¡Ganaste el juego! 🔥";
            this.endGame()
        } else if (this.machinePlayer.points == max) { 
            this.instructions.innerText = "😭 ¡La computadora ganó el juego! 😭";
            this.endGame()
        } 
    }

    endGame() { 
        this.player.points = 0;
        this.machinePlayer.points = 0;
        this.joystick.classList.add('disabled');
        this.restartGameButton.classList.remove('disabled');
        this.restartGameButton.addEventListener('click', () => this.restart());
    }

    restart() { 
        this.restartGameButton.classList.add('disabled');
        this.joystick.classList.remove('disabled');
        this.scoreBoard.roundResults.classList.add('disabled');
        this.player.score.innerText = 0;
        this.machinePlayer.score.innerText = 0;
        this.instructions.innerText = "El primero en llegar a 5 puntos gana.";
    }

    exitGamebutton() { 
        this.gameEndButton.classList.remove('disabled');
        this.gameEndButton.addEventListener('click', ()=> {
            this.gameEndButton.classList.add('disabled');
            if (this.scoreBoard.showGameStats(this.machinePlayer.score.innerText, this.player.score.innerText)) {
                this.endGame();
            }
        })
    }
}


class Player { 
    constructor (playerType, score,decision, weapons) { 
        this.playerType = playerType;
        this.score = score;
        this.messageDecision = decision;
        this.decision = '';
        this.weapons = weapons;
        this.played = false;
        this.points = 0;
    } 

    pointForVictory() { 
        this.points ++;
        this.score.innerText = this.points;
        if (this.playerType == "user") { 
            return "¡Ganaste un punto! 🔥"
        } else if (this.playerType == "machine") { 
            return "¡La computadora ganó un punto! 😭"
        }
        
    }
}

class UserPlayer extends Player {
    playUser() { 
        this.weapons.forEach(weapon => {
            weapon.addEventListener('click', (event) =>{
                this.decision = event.currentTarget.id;
                this.messageDecision.innerText = this.decision
            })
        });
    }
}

class MachinePlayer extends Player {
    playMachine() { 
        let decision = Math.floor(Math.random()*3);
        switch (decision) { 
            case 0: 
                this.decision = "piedra🪨";break;
            case 1:
                this.decision = "papel📋";break;
            case 2: 
                this.decision = "tijera✂️";break;
        };
        this.messageDecision.innerText = this.decision;
        this.played = true;
        
    }
}



class ScoreBoard {
    constructor(messageForRoundWinner, roundResults, gameStats, message) {
        this.messageForRoundWinner = messageForRoundWinner;
        this.roundResults = roundResults;
        this.gameStats = gameStats;
        this.message = message;
    }

    showRoundResults() { 
        this.roundResults.classList.remove('disabled');
    }

    showGameStats(puntosPc, puntosUser) { 
        this.gameStats.classList.remove('disabled');
        this.roundResults.classList.add('disabled');
        this.message.innerText = `La computadora gano ${puntosPc} partidas 🆚 Usted gano ${puntosUser} partidas`;
        return true
    }
}


window.addEventListener('load', () => {
    const user = new UserPlayer('user', document.querySelector('#puntos-usuario'), document.querySelector('#eleccion-usuario'), document.querySelectorAll(".arma"));
    const pc = new MachinePlayer('machine', document.querySelector('#puntos-computadora'), document.querySelector('#eleccion-computadora'), document.querySelectorAll(".arma"));
    const scoreBoard1 = new ScoreBoard(document.querySelector("#gana-punto"), document.querySelector("#mensaje"), document.querySelector(".estadistica"), document.querySelector(".mensaje-despedida"));
    const game = new Game(user, pc, document.querySelector("#instrucciones"), scoreBoard1, document.querySelector("#elegi-tu-arma"),document.querySelector("#reiniciar"), document.querySelector("#finalizar"));
    game.startGame()
});


