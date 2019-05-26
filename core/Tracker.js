import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge"

const gaTracker = new GoogleAnalyticsTracker("UA-127958837-1");

export class Tracker {
  constructor(gaTracker) {
    this.gaTracker = gaTracker;
  }

  trackEvent(name, data) {
    gaTracker.trackEvent(`${name}`, JSON.stringify(data));
  }

}
