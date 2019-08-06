import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Thing from "./components/thing/Thing";
import { notifications, things, storage, tracker } from './core/factory.js';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    notifications.configureNotifications();
    notifications.scheduleNotifications();
    // core.init();
    this.init()
  }

  init() {
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
          things.update({
            todaysThing: lastCompleted
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
                // thingsGateway.checkForNew() if there are new things, then update the store, then... 
                things.getNewThing();
              } else {
                // today’s thing has been set: use it.
                things.update({
                  todaysThing: JSON.parse(todaysThing),
                  thingCompletedToday: false,
                })
                // things.state.todaysThing = JSON.parse(todaysThing);
                // this.setState({ todaysThing: JSON.parse(todaysThing) });
              }
            })
            .catch(error => {
              tracker.trackEvent("error", { source: "App.js:init()", description: "failed to get new thing during init." });
              things.getNewThing();
              console.error(error);
            });
        }
      })
      .catch(error => {
        tracker.trackEvent("error", { source: "App.js:init()", description: "failed to access local storage in init." });
        console.error(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Thing />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
