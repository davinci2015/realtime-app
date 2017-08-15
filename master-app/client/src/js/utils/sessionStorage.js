class SessionStorage {
    /**
     * @method get
     * @param key {String} Item key
     * @return {String|Object|Null}
     */
    get(key) {
        try {
            return JSON.parse(sessionStorage.getItem(key));
        } catch (e) {
            return sessionStorage.getItem(key);
        }
    }

    /**
     * @method set
     * @param key {String} Item key
     * @param val {String|Object} Item value
     * @return {String|Object} The value of the item just set
     */
    set(key, val) {
        sessionStorage.setItem(key, JSON.stringify(val));
        return this.get(key);
    }

    /**
     * Remove item from local storage
     * @param key {String} Item key
     */
    remove(key) {
        sessionStorage.removeItem(key);
    }

    /**
     * Remove multiple keys
     * @param keys {Array} - array of keys
     */
    removeMultiple(keys) {
        keys.forEach(key => {
            sessionStorage.removeItem(key);
        });
    }
}

export default new SessionStorage();