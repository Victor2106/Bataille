'use strict';

class Card {
    constructor (power, type) {
        this.power = power;
        this.type = type;
    }

    get name () {
        return ['Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept', 'Huit', 'Neuf', 'Dix', 'Valet', 'Reine', 'Roi', 'As'][this.power];
    }

    toString () {
        return this.type + ' ' + this.name;
    }

    static getTypes () {
        return ['Trèfle', 'Carreau', 'Pique', 'Cœur'];
    }
}

module.exports = Card;