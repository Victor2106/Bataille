'use strict';

const { shuffle } = require("./Utils");

class Player {
    constructor () {
        this.cards = [];
        this.heap = [];
    }

    deleteFirstCard () {
        this.cards.splice(0, 1);
    }

    nextCard () {
        if (this.cards.length === 0) {
            if (!this.restoreCards()) return null;
        }
        return this.cards.splice(0, 1)[0];
    }

    haveCards () {
        return this.cards.length > 0 || this.heap.length > 0;
    }

    restoreCards () {
        if (this.heap.length === 0) return false;
        this.cards = shuffle(this.heap);
        this.heap = [];
        return true;
    }

    shuffleCards () {
        if (this.cards.length <= 0) {
            this.cards = shuffle(this.heap);
            this.heap = [];
        }
    }

    get firstCard () {
        return this.cards[0];
    }
}

module.exports = Player;
