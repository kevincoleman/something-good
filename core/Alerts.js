import { Alert } from "react-native";

export class Alerts {
  oneThingPerDay() {
    this.alertPresent = true;
    Alert.alert(
      "Only one thing per day!",
      "It’s totally tubular that you want to do more good things. This app is just designed to help you do one good thing each day. Come back tomorrow for more!",
      [
        {
          text: "Ok",
          onPress: () => (this.alertPresent = false),
          style: "cancel"
        }
      ]
    );
  }

  cantDoThing() {
    this.alertPresent = true;
    Alert.alert(
      "Can’t do today’s thing?",
      "You can get a new thing if you need it.",
      [
        {
          text: "Never mind",
          onPress: () => {
            this.alertPresent = false;
            return false;
          },
          style: "cancel"
        },
        {
          text: "Get a new one",
          onPress: () => {
            this.alertPresent = false;
            this.handleSkipThing();
          },
          style: "default"
        }
      ]
    );
  }
}
