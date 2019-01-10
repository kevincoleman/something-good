import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Storage } from "../../services/storage";
import encouragement from "../../core/encouragement.js";
import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";
import DeviceInfo from "react-native-device-info";
import RNShake from "react-native-shake";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Alerts from "../../core/Alerts";
import Utility from "../../core/Utility";
let PushNotification = require("react-native-push-notification");

const alerts = new Alerts();
const utility = new Utility();
const tracker = new GoogleAnalyticsTracker("UA-127958837-1");
const storage = new Storage();

PushNotification.configure({
  onNotification: function(notification) {
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  }
});

// Set notifications to start, repeating at 8am
PushNotification.localNotificationSchedule({
  message: "Remember to do something good today",
  repeatType: "day",
  date: utility.getNextMorning()
});

PushNotification.setApplicationIconBadgeNumber(1);

class Thing extends Component {
  constructor() {
    super();
    this.state = {
      todaysThing: {
        title: "",
        completed: false,
        dateRetrieved: "",
        dateCompleted: ""
      },
      completedThingToday: false
    };
    alerts.cantDoThing = alerts.cantDoThing.bind(this);
    alerts.oneThingPerDay = alerts.oneThingPerDay.bind(this);
  }
  alertPresent = false;

  componentWillMount() {
    // DEV USE ONLY:
    // storage.store("lastCompletedThing", JSON.stringify(this.state.todaysThing)); // reset item status for testing
    // this.getNewThing(); // get new thing on each load

    // Handle shake events
    RNShake.addEventListener("ShakeEvent", () => {
      if (!this.state.completedThingToday) {
        this.getNewThing();
      } else {
        if (!this.alertPresent) {
          alerts.oneThingPerDay();
          this.alertPresent = true;
        }
      }
      ReactNativeHapticFeedback.trigger("impactLight", true);
    });

    // prep app state for the day
    let lastCompleted = {};
    storage
      .retrieve("lastCompletedThing")
      .then(thing => {
        lastCompleted = JSON.parse(thing);
        // check if the user already did today’s thing...
        if (
          lastCompleted &&
          lastCompleted.dateCompleted !== "" &&
          lastCompleted.dateCompleted == utility.getToday()
        ) {
          PushNotification.setApplicationIconBadgeNumber(0);
          // don’t get a new item, just use the completed one.
          this.setState({
            todaysThing: lastCompleted,
            completedThingToday: true
          });
        } else {
          PushNotification.setApplicationIconBadgeNumber(1);
          // if the user hasn’t completed today’s thing, check if it’s already been set.
          storage
            .retrieve("todaysThing")
            .then(todaysThing => {
              if (
                todaysThing === undefined ||
                JSON.parse(todaysThing).dateRetrieved !== utility.getToday()
              ) {
                // if today’s thing hasn’t been set, set it.
                this.getNewThing();
              } else {
                // if today’s thing has been set, use it.
                this.setState({ todaysThing: JSON.parse(todaysThing) });
              }
            })
            .catch(error => {
              this.getNewThing();
              console.error(error);
            });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  getNewThing() {
    fetch("https://things.somethinggood.app/goodThings.json", {
      Accept: "application/json"
    })
      .then(res => {
        return res.json();
      })
      .then(things => {
        const thing = things[Math.floor(Math.random() * things.length)];
        const todaysThing = {
          title: thing.title,
          completed: false,
          dateRetrieved: utility.getToday(),
          id: thing.id
        };
        tracker.trackEvent(
          "loadNewThing",
          JSON.stringify({
            uid: DeviceInfo.getUniqueID(),
            todaysThing
          })
        );
        storage.store("todaysThing", JSON.stringify(todaysThing));
        this.setState({
          todaysThing: todaysThing
        });
      })
      .catch(error => {
        // default in case there’s no connection
        const todaysThing = {
          title: "Smile at someone.",
          completed: false,
          dateRetrieved: utility.getToday(),
          id: 0
        };
        storage.store("todaysThing", JSON.stringify(todaysThing));
        this.setState({
          todaysThing: todaysThing
        });
        console.log(error);
      });
    this.props.colorChange();
  }

  handleCompleteThing() {
    PushNotification.setApplicationIconBadgeNumber(0);
    const completedThing = {
      title: this.state.todaysThing.title,
      completed: true,
      dateCompleted: utility.getToday()
    };
    tracker.trackEvent(
      "completeThing",
      JSON.stringify({
        uid: DeviceInfo.getUniqueID(),
        completedThing
      })
    );
    storage.store("lastCompletedThing", JSON.stringify(completedThing));
    this.setState({ todaysThing: completedThing, completedThingToday: true });
  }

  render() {
    let actionArea;
    if (
      !this.state.todaysThing.completed &&
      this.state.todaysThing.title !== ""
    ) {
      actionArea = (
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleCompleteThing.bind(this)}
          >
            <Text style={styles.buttonText}>I did it!</Text>
          </TouchableOpacity>
          <Text style={styles.cantDo} onPress={alerts.cantDoThing}>
            I can’t do that thing today.
          </Text>
        </View>
      );
    } else if (this.state.todaysThing.title !== "") {
      actionArea = (
        <Text style={styles.basicText}>
          {encouragement[Math.floor(Math.random() * encouragement.length)] +
            " "}
          Come back tomorrow for another good thing to do.
        </Text>
      );
    }

    return (
      <View style={styles.container}>
        <Text
          style={
            this.state.todaysThing.completed
              ? styles.completedThing
              : styles.todaysThing
          }
        >
          {this.state.todaysThing.title}
        </Text>
        {actionArea}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  todaysThing: {
    fontSize: 44,
    color: "#ffffff"
  },
  completedThing: {
    fontSize: 44,
    color: "rgba(255, 255, 255, 0.8)",
    textDecorationLine: "line-through"
  },
  button: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 3
  },
  buttonText: {
    fontSize: 24,
    color: "#333333"
  },
  cantDo: {
    color: "#ffffff",
    textAlign: "center",
    marginTop: 15
  },
  basicText: {
    color: "#ffffff",
    fontSize: 18
  }
});

export default Thing;