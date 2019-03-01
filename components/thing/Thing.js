import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Storage } from "../../core/Storage";
import { encouragement } from "../../core/config";
import RNShake from "react-native-shake";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Alerts from "../../core/Alerts";
import Notifications from "../../core/Notifications";
import Things from "../../core/Things/Things";

const alerts = new Alerts();
const things = new Things();
const notifications = new Notifications();
const storage = new Storage();

class Thing extends Component {
  alertPresent = false;

  constructor(alerts, things, notifications, storage) {
    super();
    this.alerts = alerts;
    this.things = things;
    this.notifications = notifications;
    this.storage = storage;

    this.state = {
      todaysThing: {
        title: "",
        completed: false,
        dateRetrieved: "",
        dateCompleted: ""
      },
      completedThingToday: false
    };
    // alerts.cantDoThing = alerts.cantDoThing.bind(this);
    // alerts.oneThingPerDay = alerts.oneThingPerDay.bind(this);
  }

  componentDidMount() {
    // DEV USE ONLY:
    // storage.store("lastCompletedThing", JSON.stringify(this.state.todaysThing)); // reset item status for testing

    // get new thing on each load
    things.getNewThing().then(thing => {
      this.setState({ todaysThing: thing });
    });

    // set up daily notifications
    notifications.configureNotifications();
    notifications.scheduleNotifications();

    // Handle shake events
    RNShake.addEventListener("ShakeEvent", () => {
      if (this.alertPresent) {
        return false;
      }
      if (!this.state.completedThingToday) {
        this.skipThing();
      } else {
        alerts.oneThingPerDay();
        this.alertPresent = true;
      }
      ReactNativeHapticFeedback.trigger("impactLight", true);
    });

    // prep app state for the day
    let lastCompleted = {};
    storage
      .retrieve("lastCompletedThing")
      .then(thing => {
        lastCompleted = JSON.parse(thing);
        if (
          lastCompleted &&
          lastCompleted.dateCompleted !== "" &&
          lastCompleted.dateCompleted == new Date().toDateString()
        ) {
          // user did today’s thing: just use that thing
          notifications.removeBadge();
          this.setState({
            todaysThing: lastCompleted,
            completedThingToday: true
          });
        } else {
          // user didn’t do today’s thing: check if thing is already set
          notifications.addBadge();
          storage
            .retrieve("todaysThing")
            .then(todaysThing => {
              if (
                todaysThing === null ||
                JSON.parse(todaysThing).dateRetrieved !==
                  new Date().toDateString()
              ) {
                // today’s thing hasn’t been set: set it.
                let thing = things.getNewThing();
                this.setState({ todaysThing: thing });
              } else {
                // today’s thing has been set: use it.
                this.setState({ todaysThing: JSON.parse(todaysThing) });
              }
            })
            .catch(error => {
              things.getNewThing().then(thing => {
                this.setState({ todaysThing: thing });
              });
              console.error(error);
            });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  skipThing() {
    // const skippedThing = this.state.todaysThing;
    // tracker.trackEvent("skipThing", { thing: skippedThing });
    // things.getNewThing().then(thing => {
    //   this.setState({ todaysThing: thing });
    // });
  }

  // getNewThing() {
  //   fetch("https://things.somethinggood.app/goodThings.json", {
  //     Accept: "application/json"
  //   })
  //     .then(res => {
  //       return res.json();
  //     })
  //     .then(things => {
  //       const thing = things[Math.floor(Math.random() * things.length)];
  //       const todaysThing = {
  //         title: thing.title,
  //         completed: false,
  //         dateRetrieved: new Date().toDateString(),
  //         id: thing.id
  //       };
  //       tracker.trackEvent(
  //         "loadNewThing",
  //         JSON.stringify({
  //           thing: todaysThing,
  //           status: "loaded",
  //           uid: DeviceInfo.getUniqueID()
  //         })
  //       );
  //       storage.store("todaysThing", JSON.stringify(todaysThing));
  //       this.setState({
  //         todaysThing: todaysThing
  //       });
  //     })
  //     .catch(error => {
  //       // default in case there’s no connection
  //       const todaysThing = {
  //         title: "Smile at someone.",
  //         completed: false,
  //         dateRetrieved: new Date().toDateString(),
  //         id: 0
  //       };
  //       storage.store("todaysThing", JSON.stringify(todaysThing));
  //       this.setState({
  //         todaysThing: todaysThing
  //       });
  //       console.log(error);
  //     });
  //   this.props.colorChange();
  // }

  handleCompleteThing() {
    const completedThing = {
      title: this.state.todaysThing.title,
      completed: true,
      dateCompleted: new Date().toDateString()
    };
    // tracker.trackEvent("completeThing", {
    //   thing: completedThing,
    //   status: "completed",
    //   uid: DeviceInfo.getUniqueID()
    // });
    storage
      .store("lastCompletedThing", JSON.stringify(completedThing))
      .then(() => {
        notifications.removeBadge();
        notifications.scheduleNotifications();
      });
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
