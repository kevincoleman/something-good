import AsyncStorage from '@react-native-community/async-storage';

export class Storage {
  constructor(tracker) {
    this.tracker = tracker;
  }

  async store(name, data) {
    try {
      await AsyncStorage.setItem(`@${name}`, data);
    } catch (error) {
      tracker.trackEvent(
        "error",
        { source: "Storage.js:store()", description: "Failed to set item in local storage." }
      );
      console.error(error);
    }
  }

  async retrieve(name) {
    try {
      const value = await AsyncStorage.getItem(`@${name}`);
      return value;
    } catch (error) {
      tracker.trackEvent(
        "error",
        { source: "Storage.js:retrieve()", description: "Failed to get item from local storage." }
      );
      console.error(error);
    }
  }
}
