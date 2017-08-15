import config from '../config';
import strings from '../utils/strings';

const sseConfig = {
    baseURL: config.apiBaseUrl,
    path: '/users/observe'
};

class SseHandler {
    /**
     * SseHandler constructor
     * @param onMessage {Function}
     * @param onOpen {Function}
     * @param onError {Function}
     * @param id {String}
     * @param customEvents {Array}
     * @param customEvents[] {Object}
     * @param customEvents[].name {String} - event name
     * @param customEvents[].handler {Function} - event handler
     */
    constructor({onMessage, onOpen, onError, id, customEvents}) {
        if (this._isEventSourceEnabled()) {
            let url = `${sseConfig.baseURL}${sseConfig.path}?id=${id}`;
            this._source = new EventSource(url);
            this._addEventHandlers({onMessage, onOpen, onError, customEvents});
        } else {
            console.log(strings.NOT_SUPPORTED);
        }
    }

    _isEventSourceEnabled() {
        return !!window.EventSource;
    }

    _addEventHandlers({onMessage, onOpen, onError, customEvents}) {
        this._source.onmessage = function (e) {
            onMessage(JSON.parse(e.data));
        };

        this._source.onopen = function () {
            onOpen(strings.CONNECTION_OPENED);
        };

        this._source.onerror = function (e) {
            if (e.target.readyState === EventSource.CLOSED) {
                onError(strings.DISCONNECTED);
            }
            else if (e.target.readyState === EventSource.CONNECTING) {
                onError(strings.CONNECTING);
            }
        }

        if (customEvents.length) {
            customEvents.forEach(event => {
                this._source.addEventListener(event.name, function(e) {
                    event.handler(JSON.parse(e.data));
                });
            });
        }
    }

    closeConnection() {
        if (this._source) {
            this._source.close();
        }
    }
}

export default SseHandler;