import { Alert } from "react-native";

export class Alerts {
  constructor(things, tracker) {
    this.things = things;
    this.tracker = tracker;
    this.state = {
      alertPresent: false
    }
  }

  oneThingPerDay() {
    this.state.alertPresent = true;
    Alert.alert(
      "Only one thing per day!",
      "It’s totally tubular that you want to do more good things. This app is just designed to help you do one good thing each day. Come back tomorrow for more!",
      [
        {
          text: "Ok",
          onPress: () => (this.state.alertPresent = false),
          style: "cancel"
        }
      ]
    );
    this.tracker.trackEvent("try_for_second_thing", {});
  }

  cantDoThing() {
    this.state.alertPresent = true;
    Alert.alert(
      "Can’t do today’s thing?",
      "You can get a new thing if you need it.",
      [
        {
          text: "Never mind",
          onPress: () => {
            this.state.alertPresent = false;
            this.tracker.trackEvent("alert_cant_do_thing", {action: "keep current thing"});
            return false;
          },
          style: "cancel"
        },
        {
          text: "Get a new one",
          onPress: () => {
            this.state.alertPresent = false;
            this.things.skipThing();
            this.tracker.trackEvent("alert_cant_do_thing", {action: "get a new thing"});
          },
          style: "default"
        }
      ]
    );
  }
}
