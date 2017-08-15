const constants = {
    CONNECTION_OPENED: "Connection opened",
    DISCONNECTED: "Disconnected",
    CONNECTING: "Connecting...",
    NOT_SUPPORTED: "Event source not supported"
};

const uiHandler = {
    cacheElems: function () {
        this.$item = $(".item");
    },

    updateText: function (message) {
        try {
            const data = JSON.parse(message);
            Object.keys(data).forEach(key => {
                const currentItem = this.$item.find("[data-name='" + key + "']");
                currentItem.siblings(".item__price").html(data[key].price + "$");
                currentItem.siblings(".item__change").html(data[key].change + "%");
            });
        } catch (e) {}
    },

    init: function () {
        this.cacheElems();
    }
};

const sseHandler = {
    url: "http://localhost:8000/stream",
    source: undefined,

    isEventSourceEnabled: function () {
        return !!window.EventSource;
    },

    closeConnection: function () {
        if (this.source) {
            this.source.close();
        }
    },

    addEventHandlers: function () {
        this.source.onmessage = function (e) {
            uiHandler.updateText(e.data);
        };

        this.source.onopen = function () {
            uiHandler.updateText(constants.CONNECTION_OPENED);
        };

        this.source.onerror = function (e) {
            if (e.target.readyState === EventSource.CLOSED) {
                uiHandler.updateText(constants.DISCONNECTED);
            }
            else if (e.target.readyState === EventSource.CONNECTING) {
                uiHandler.updateText(constants.CONNECTING);
            }
        }
    },

    init: function () {
        if (this.isEventSourceEnabled()) {
            this.source = new EventSource(this.url);
            this.addEventHandlers();
        } else {
            uiHandler.updateText(constants.NOT_SUPPORTED);
        }
    }
};

$(document).ready(function () {
    const $btnSubscribe = $("#btnSubscribe");
    const $btnClose = $("#btnClose");
    const $btns = $(".btn");
    const disabledClass = "disabled";

    $btnSubscribe.click(function () {
        uiHandler.init();
        sseHandler.init();
        $btns.toggleClass(disabledClass);
    });

    $btnClose.click(function () {
        sseHandler.closeConnection();
        $btns.toggleClass(disabledClass);
    });
});