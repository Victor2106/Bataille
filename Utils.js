module.exports.shuffle = (array) => {
    const cardsShuffle = array;

    for (let i = cardsShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);

        const temp = cardsShuffle[i];
        cardsShuffle[i] = cardsShuffle[j];
        cardsShuffle[j] = temp;
    }

    return cardsShuffle;
}
