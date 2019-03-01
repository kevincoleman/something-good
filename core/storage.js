import { AsyncStorage } from "react-native";

export class Storage {
  constructor() {}

  async store(name, data) {
    try {
      await AsyncStorage.setItem(`@${name}`, data);
    } catch (error) {
      console.error(error);
    }
  }

  async retrieve(name) {
    try {
      const value = await AsyncStorage.getItem(`@${name}`);
      return value;
    } catch (error) {
      console.error(error);
    }
  }
}
