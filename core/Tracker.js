export class Tracker {
  constructor(tracker) {
    this.tracker = tracker;
  }

  trackEvent(name, data) {
    this.tracker.trackEvent(`${name}`, JSON.stringify(data));
  }
}
