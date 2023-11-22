'use strict';

const Card = require('./Card');
const Player = require('./Player');
const { shuffle } = require("./Utils");

class Game {
    constructor (cards = 52) {
        this.playerOne = new Player();
        this.playerTwo = new Player();

        this.cards = cards;
    }

    createCards () {
        const cards = [];
        const types = Card.getTypes();

        for (const cardType of types) {
            for (let i = 0; i < this.cards / types.length ; i++) {
                cards.push(new Card(i, cardType));
            }
        }

        return cards;
    }

    shuffleCards () {
        return shuffle(this.createCards());
    }

    distributeCards () {
        const cards = this.shuffleCards();

        for (let i = 0; i < cards.length; i++) {
            if (i % 2 === 0) {
                this.playerOne.cards.push(cards[i]);
            } else {
                this.playerTwo.cards.push(cards[i]);
            }
        }
    }

    checkWinner () {
        if (!this.playerOne.haveCards()) return this.playerTwo;
        if (!this.playerTwo.haveCards()) return this.playerOne;
    }

    wait (time) {
        return new Promise((resolve => setTimeout(resolve, time)));
    }

    play (logging) {
        let rounds = 0;
        while (this.playerOne.haveCards() && this.playerTwo.haveCards()) {
            rounds++;

            const playerOneCard = this.playerOne.nextCard();
            const playerTwoCard = this.playerTwo.nextCard();

            if (logging) console.log(['Round n°' + rounds], 'Joueur 1: ' + playerOneCard + ' | Joueur 2: ' + playerTwoCard + ' Cartes en jeu: ' + (this.playerOne.cards.length + this.playerTwo.cards.length + this.playerOne.heap.length + this.playerTwo.heap.length));

            if (playerOneCard.power === playerTwoCard.power) {
                let battleCount = 1;
                if (logging) console.log(['BattleRound'], 'Une bataille à lieu');
                let stackedCard = [
                    [playerOneCard, this.playerOne.nextCard(), this.playerOne.nextCard()],
                    [playerTwoCard, this.playerTwo.nextCard(), this.playerTwo.nextCard()]
                ];

                if (this.checkWinner()) {
                    if (logging) console.log(['BattleRound'], 'Le joueur n°' + (this.checkWinner() === this.playerOne ? '2' : '1') + ' n\'a plus de cartes.');
                    return {
                        winner: this.checkWinner(), rounds
                    };
                }

                if (logging) console.log(['BattleRound'], 'Bataille -> Joueur 1: ' + stackedCard[0][stackedCard[0].length - 1] + ' | Joueur 2: ' + stackedCard[1][stackedCard[1].length - 1]);
                while (stackedCard[0][stackedCard[0].length - 1].power === stackedCard[1][stackedCard[1].length - 1].power) {
                    if (logging) console.log(['BattleRound'], 'Bataille n°' + battleCount);
                    let winner = this.checkWinner();
                    if (winner) {
                        if (logging) console.log(['BattleRound'], 'Le joueur n°' + (winner === this.playerOne ? '2' : '1') + ' n\'a plus de cartes.');
                        return {
                            winner, rounds
                        };
                    }

                    stackedCard = [[...stackedCard[0], this.playerOne.nextCard()], [...stackedCard[1], this.playerTwo.nextCard()]];

                    winner = this.checkWinner();
                    if (winner) {
                        if (logging) console.log(['BattleRound'], 'Le joueur n°' + (winner === this.playerOne ? '2' : '1') + ' n\'a plus de cartes.');
                        return {
                            winner, rounds
                        };
                    }

                    stackedCard = [[...stackedCard[0], this.playerOne.nextCard()], [...stackedCard[1], this.playerTwo.nextCard()]];
                    battleCount++;
                    rounds++;
                }

                const winner = stackedCard[0][stackedCard[0].length - 1].power > stackedCard[1][stackedCard[1].length - 1].power ? this.playerOne : this.playerTwo;
                if (logging) console.log(['BattleRound'], 'Le joueur n°' + (this.playerOne === winner ? '1' : '2') + ' a gagné la bataille ! +' + stackedCard.flat().length);
                winner.heap = [...stackedCard.flat(), ...winner.heap];
                if (logging) console.log('[1] : Paquet ' + (this.playerOne.cards.length) + ' Tas ' + this.playerOne.heap.length + ' \n[2] : Paquet ' + (this.playerTwo.cards.length) + ' Tas ' + this.playerTwo.heap.length);
                continue;
            }

            const winner = playerOneCard.power > playerTwoCard.power ? this.playerOne : this.playerTwo;
            winner.heap = [...winner.heap, playerOneCard, playerTwoCard];
            if (logging) console.log(['Round'], 'Le joueur n°' + (this.playerOne === winner ? '1' : '2') + ' a gagné la manche ! +2');
            if (logging) console.log('[1] : Paquet ' + (this.playerOne.cards.length) + ' Tas ' + this.playerOne.heap.length + ' \n[2] : Paquet ' + (this.playerTwo.cards.length) + ' Tas ' + this.playerTwo.heap.length);
        }

        if (logging) this.playerOne.cards.length > 0 ? console.log("Le joueur n°1 a gagné ! En " + rounds + " tours") : console.log("Le joueur n°2 a gagné ! En " + rounds + " tours");
        return {
            winner: this.checkWinner(), rounds
        };
    }
}

function simulateGame(n) {
    let totalRounds = 0;
    let totalWinPlayerOne = 0;
    let totalWinPlayerTwo = 0;

    for (let i = 0; i < n; i++) {
        const game = new Game();
        game.distributeCards();
        const r = game.play();
        totalRounds += (r.rounds);
        if (r.winner === game.playerOne) totalWinPlayerOne++;
        else totalWinPlayerTwo++;
    }

    console.log(totalRounds / n);
    console.log(["Joueur 1"], totalWinPlayerOne / n + ` parties gagnées`);
    console.log(["Joueur 2"], totalWinPlayerTwo / n + ` parties gagnées`);

    return totalWinPlayerOne / n;
}

function estim(N, n) {
    let c = 0;
    for (let i = 0; i < N; i++) {
        let f = simulateGame(n);
        if (Math.abs(f - 1/2) <= Math.sqrt(n)) { 
            c++;
        }
    }

    return console.log(c/N);
}

estim(100, 1000);