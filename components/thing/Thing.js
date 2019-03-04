import React, { Component } from "react";
import { View, Text } from "react-native";

import CompleteButton from "../completeButton/CompleteButton";

import { Things } from "../../core/Things/Things";
import { Notifications } from "../../core/Notifications";
import { Storage } from "../../core/Storage";
import { Tracker } from "../../core/Tracker";
import { Alerts } from "../../core/Alerts";
import { styles } from "./Thing.styles";

const things = new Things();
const notifications = new Notifications();
const storage = new Storage();
const tracker = new Tracker();
const alerts = new Alerts();

class Thing extends Component {
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
    this.handleCompleteThing = this.handleCompleteThing.bind(this);
    this.handleSkipThing = this.handleSkipThing.bind(this);
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
        <CompleteButton
          completed={this.state.todaysThing.completed}
          handleCompleteThing={this.handleCompleteThing}
          handleSkipThing={this.handleSkipThing}
          cantDoThing={alerts.cantDoThing}
          oneThingPerDay={alerts.oneThingPerDay}
        />
      </View>
    );
  }
}

export default Thing;
