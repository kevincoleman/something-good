import { Alert } from "react-native";

export class Alerts {
  oneThingPerDay(context) {
    context.alertPresent = true;
    Alert.alert(
      "Only one thing per day!",
      "It’s totally tubular that you want to do more good things. This app is just designed to help you do one good thing each day. Come back tomorrow for more!",
      [
        {
          text: "Ok",
          onPress: () => (context.alertPresent = false),
          style: "cancel"
        }
      ]
    );
  }

  cantDoThing(context) {
    context.alertPresent = true;
    Alert.alert(
      "Can’t do today’s thing?",
      "You can get a new thing if you need it.",
      [
        {
          text: "Never mind",
          onPress: () => {
            context.alertPresent = false;
            return false;
          },
          style: "cancel"
        },
        {
          text: "Get a new one",
          onPress: () => {
            context.alertPresent = false;
            this.handleSkipThing();
          },
          style: "default"
        }
      ]
    );
  }
}
