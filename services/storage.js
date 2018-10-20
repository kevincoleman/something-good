import { AsyncStorage } from "react-native";

export class Storage {
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
      if (value !== null) {
        return value;
      }
    } catch (error) {
      console.error(error);
    }
  }
}
