import analytics from '@react-native-firebase/analytics';

export class Tracker {
  // name: string
  // data: object
  async trackEvent(name, data) {
    await analytics().logEvent(name, data);
  }
}
