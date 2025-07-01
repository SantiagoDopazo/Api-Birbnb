class EventManager {
    constructor() {
        this.listeners = new Map();
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    async emit(event, data) {
        if (!this.listeners.has(event)) {
            return;
        }

        const callbacks = this.listeners.get(event);
        const promises = callbacks.map(async (callback) => {
            try {
                await callback(data);
            } catch (error) {
            }
        });
        await Promise.allSettled(promises);
    }

    off(event, callback) {
        if (!this.listeners.has(event)) {
            return;
        }

        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }
}

export const eventManager = new EventManager(); 