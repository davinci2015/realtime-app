const observers = new WeakMap();

class SubjectObserver {
    constructor() {
        observers.set(this, []);
    }
}

SubjectObserver.prototype.addObserver = function (observer) {
    const currObservers = observers.get(this);
    currObservers.push(observer);
    observers.set(this, currObservers);
};

SubjectObserver.prototype.removeObserver = function (observerID) {
    const currObservers = observers.get(this);
    for (let i = 0; i < currObservers.length; i++) {
        if (currObservers[i].id === observerID) {
            currObservers.splice(i, 1);
            observers.set(this, currObservers);
            return;
        }
    }
};

SubjectObserver.prototype.notifyObservers = function (...args) {
    const currObservers = observers.get(this);

    // Notify all observers
    currObservers.forEach(function (observer) {
        if (typeof observer.update === 'function') {
            observer.update.apply(observer, args);
        }
    });
};

SubjectObserver.prototype.notifyObserverById = function(id, ...args) {
    const currObservers = observers.get(this);

    for (let i = 0; i < currObservers.length; i++) {
        if (currObservers[i].id === id) {
            if (typeof currObservers[i].update === 'function') {
                currObservers[i].update.apply(currObservers[i], args);
            }
            return;
        }
    }
};

module.exports = SubjectObserver;