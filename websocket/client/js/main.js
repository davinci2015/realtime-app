const Basket = function () {
    const currency = "HRK";
    let priceSum = 0;
    let articles = [];

    this.addToBasket = (name, price) => {
        articles.push({ name, price });
        priceSum += price;
    };

    this.getLastAddedArticle = () => articles[articles.length - 1];
    this.getPriceSum = () =>`${priceSum.toFixed(2)} ${currency}`;
};

const UIHandler = function () {
    let $basketTable = $('.basket__table');
    let $priceSum = $('.basket__sum');
    let $cta = $('.card-action');

    let composeRow = data => {
        let row = "<tr>";
        Object.keys(data).forEach(key => row += `<td>${data[key]}</td>`);
        row += "</tr>";
        return row;
    };

    this.attachEvents = articleOnClickCallback => {
        $cta.click(function () {
            let article = $(this).siblings(".article");
            articleOnClickCallback({
                name: article.find("[data-article-name]").data("article-name"),
                price: article.find("[data-article-price]").data("article-price")
            });
        })
    };

    this.updateTable = rowData => {
        let row = composeRow(rowData);
        $basketTable.append(row);
    };

    this.updatePriceSum = sum => $priceSum.html(sum);
};

const SocketHandler = function ({ socketUrl, onMessageCallback }) {
    this.sendMessage = message => websocket.send(JSON.stringify(message));
    const onOpen = () => console.log("Connected to web socket");
    const onMessage = (e, callback) => {
        try {
            let message = JSON.parse(e.data);
            callback(null, message);
        } catch (error) {
            callback(error);
        }
    };

    const websocket = new WebSocket(socketUrl);
    websocket.onmessage = e => onMessage(e, onMessageCallback);
    websocket.onopen = onOpen;
};

let basket = new Basket();
let uiHandler = new UIHandler(basket);
let socket = new SocketHandler({
    socketUrl: "ws://localhost:8080",
    onMessageCallback: (error, result) => {
        if (error) {
            throw new Error("Can't add article to basket");
        }
        basket.addToBasket(result.name, result.price);
        uiHandler.updateTable(basket.getLastAddedArticle());
        uiHandler.updatePriceSum("Ukupan iznos: " + basket.getPriceSum());
    }
});

uiHandler.attachEvents(article => socket.sendMessage(article));
