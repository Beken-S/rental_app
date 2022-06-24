export class Timer {
  id: number | null;
  _timerEndEvent: Event;

  constructor() {
    this._timerEndEvent = new Event('timer-end');
  }

  start(time: number): void {
    this.id = setTimeout(() => {
      document.dispatchEvent(this._timerEndEvent);
      return;
    }, time);
  }
  stop(): void {
    if (this.id != null) clearTimeout(this.id);
  }
}
