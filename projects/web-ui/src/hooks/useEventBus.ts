import { create } from "zustand";

type EventHandler = (...args: any[]) => void;

class EventBus {
    private events: { [key: string]: EventHandler[] } = {};

    public on(event: string, handler: EventHandler): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(handler);
    }

    public off(event: string, handler: EventHandler): void {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(h => h !== handler);
    }

    public emit(event: string, ...args: any[]): void {
        if (!this.events[event]) return;
        this.events[event].forEach(handler => handler(...args));
    }
}

const eventBus = new EventBus();

interface enventBusInterface {
    getEventBus: () => EventBus;
}
export const useEventBus = create<enventBusInterface>(() => ({
    getEventBus: () => {
        return eventBus;
    },
}));