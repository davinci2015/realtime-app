const helper = {
    calculateAverage(arr) {
        if (!arr.length) return 0;
        let sum = 0;
        arr.forEach(rating => {
            sum += rating;
        });
        return sum / arr.length;
    },

    /**
     * Color pallete from red to green
     * @param value {Number}
     *      - 0 == red color,
     *      - value > 0 && value < 1 == color between red and green
     *      - 1 == green color
     * @returns {string}
     */
    getColorFromRedToGreen(value) {
        const hue = (value * 120).toString(10);
        return `hsl(${hue}, 100%, 35%`;
    }
};

export default helper;