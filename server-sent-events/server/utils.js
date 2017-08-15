const generateRandomPrice = () => (Math.random() * 9).toFixed(2);
const generateRandomChange = () => (Math.random() * 5 + 1).toFixed(2);

const crypto = ["bitcoin", "ethereum", "ripple"];

module.exports = {
    generateRandomResponse: () => {
        let response = {};
        crypto.forEach(value => {
            response[value] = {
                price: generateRandomPrice(),
                change: generateRandomChange()
            }
        });
        return response;
    }
};