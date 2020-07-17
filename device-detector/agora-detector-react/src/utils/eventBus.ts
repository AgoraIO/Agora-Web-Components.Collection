import { IAgoraRTC } from 'agora-rtc-sdk-ng';
import { TrackManager } from './trackManager';
import { DeviceResult } from '../types/index';

interface EventListener {
  listener: Function;
  once: boolean;
}

interface Store {
  agoraSDK?: IAgoraRTC;
  isMobile?: boolean;
  trackManager?: TrackManager;
  cameraResult?: DeviceResult;
  micResult?: DeviceResult;
  speakerResult?: DeviceResult;
}

export class EventEmitter {
  private _events: { [key: string]: EventListener[] } = {};

  public data: Store = {};

  public on(event: string, listener: Function): void {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    const listeners = this._events[event];
    if (this._indexOfListener(listeners, listener) === -1) {
      listeners.push({
        listener,
        once: false
      });
    }
  }

  public once(event: string, listener: Function): void {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    const listeners = this._events[event];
    if (this._indexOfListener(listeners, listener) === -1) {
      listeners.push({
        listener,
        once: true
      });
    }
  }

  public off(event: string, listener: Function): void {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    const listeners = this._events[event];
    const index = this._indexOfListener(listeners, listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  public emit(event: string, ...args: any[]): void {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    const listeners = this._events[event].map((l) => l);
    for (let i = 0; i < listeners.length; i += 1) {
      const listener = listeners[i];
      if (listener.once) {
        this.off(event, listener.listener);
      }

      listener.listener.apply(this, args || []);
    }
  }

  private _indexOfListener(
    listeners: EventListener[],
    listener: Function
  ): number {
    let i = listeners.length;
    while (i--) {
      if (listeners[i].listener === listener) {
        return i;
      }
    }

    return -1;
  }
}

const eventBus = new EventEmitter();
export default eventBus;
