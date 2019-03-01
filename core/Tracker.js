import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";
import DeviceInfo from "react-native-device-info";

const gaTracker = new GoogleAnalyticsTracker("UA-127958837-1");

export default class Tracker {
  constructor(gaTracker) {
    this.gaTracker = gaTracker;
  }

  trackEvent(name, data) {
    gaTracker.trackEvent(`${name}`, JSON.stringify(data));
  }

  appendUID(data) {
    data.uid = DeviceInfo.getUniqueID();
  }
}
