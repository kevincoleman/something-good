import { Alert } from "react-native";

export default class Alerts {
  oneThingPerDay() {
    Alert.alert(
      "Only one thing per day!",
      "It’s totally tubular that you want to do more good things. This app is just designed to help you do one good thing each day. Come back tomorrow for more!",
      [
        {
          text: "Ok",
          onPress: () =>
            console.log("Tried to get a second thing after completing one"),
          style: "cancel"
        }
      ]
    );
  }

  cantDoThing() {
    Alert.alert(
      "Can’t do today’s thing?",
      "Never fear. You can get a new thing by shaking your device.",
      [
        {
          text: "Cancel",
          onPress: () => {
            return false;
          },
          style: "cancel"
        },
        {
          text: "Get one now",
          onPress: () => this.getNewThing(),
          style: "default"
        }
      ]
    );
  }
}
