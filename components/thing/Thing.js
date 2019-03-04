import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getRandomEncouragement } from "../../core/Config";
import RNShake from "react-native-shake";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

import { Alerts } from "../../core/Alerts";
import { Things } from "../../core/Things/Things";
import { Notifications } from "../../core/Notifications";
import { Storage } from "../../core/Storage";
import { Tracker } from "../../core/Tracker";

const alerts = new Alerts();
const things = new Things();
const notifications = new Notifications();
const storage = new Storage();
const tracker = new Tracker();

class Thing extends Component {
  alertPresent = false;

  constructor(things, notifications, storage) {
    super();
    this.things = things;
    this.notifications = notifications;
    this.storage = storage;
    this.tracker = tracker;

    this.state = {
      todaysThing: {
        title: "",
        completed: false,
        dateRetrieved: "",
        dateCompleted: "",
        color: ""
      },
      completedThingToday: false
    };
    alerts.cantDoThing = alerts.cantDoThing.bind(this);
    alerts.oneThingPerDay = alerts.oneThingPerDay.bind(this);
  }

  componentDidMount() {
    // DEV USE ONLY:
    // storage.store("lastCompletedThing", JSON.stringify(this.state.todaysThing)); // reset item status for testing

    // get new thing on each load
    // things.getNewThing().then(thing => {
    //   this.setState({
    //     todaysThing: thing,
    //     completedThingToday: false
    //   });
    // });

    // set up daily notifications
    notifications.configureNotifications();
    notifications.scheduleNotifications();

    // Handle shake events
    RNShake.addEventListener("ShakeEvent", () => {
      if (this.alertPresent) {
        return false;
      }
      if (!this.state.completedThingToday) {
        this.handleSkipThing();
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
                let thing = things.getNewThing().then(thing => {
                  this.setState({
                    todaysThing: thing,
                    thingCompletedToday: false
                  });
                });
              } else {
                // today’s thing has been set: use it.
                this.setState({ todaysThing: JSON.parse(todaysThing) });
              }
            })
            .catch(error => {
              things.getNewThing().then(thing => {
                this.setState({
                  todaysThing: thing,
                  completedThingToday: false
                });
              });
              console.error(error);
            });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  handleSkipThing() {
    const skippedThing = this.state.todaysThing;
    tracker.trackEvent("skipThing", { thing: skippedThing });
    things.getNewThing().then(thing => {
      this.setState({
        todaysThing: thing,
        completedThingToday: false
      });
    });
  }

  handleCompleteThing() {
    const completedThing = things.completeThing(this.state.todaysThing);
    this.setState({ todaysThing: completedThing, completedThingToday: true });
  }

  render() {
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 40,
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "red"
      },
      todaysThing: {
        fontSize: 44,
        paddingTop: 100,
        color: "#ffffff"
      },
      actionArea: {
        paddingBottom: 40
      },
      completedThing: {
        fontSize: 44,
        paddingTop: 100,
        paddingBottom: 40,
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

    let actionArea;
    if (
      !this.state.todaysThing.completed &&
      this.state.todaysThing.title !== ""
    ) {
      actionArea = (
        <View style={styles.actionArea}>
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
        <View style={styles.actionArea}>
          <Text style={styles.basicText}>
            {getRandomEncouragement() + " "}
            Come back tomorrow for another good thing to do.
          </Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.container,
          { backgroundColor: this.state.todaysThing.color }
        ]}
      >
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

export default Thing;
