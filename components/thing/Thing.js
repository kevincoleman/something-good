import React, { Component } from "react";
import { View, Text } from "react-native";

import CompleteButton from "../completeButton/CompleteButton";

import { styles } from "./Thing.styles";

import {things, notifications, storage, tracker, alerts} from '../../core/factory.js';

class Thing extends Component {
  constructor() {
    super();


    // this.state = {
    //   todaysThing: {
    //     title: "",
    //     completed: false,
    //     dateRetrieved: "",
    //     dateCompleted: "",
    //     color: ""
    //   },
    //   completedThingToday: false
    // };

    this.state = things.getThing();
    
    alerts.cantDoThing = alerts.cantDoThing.bind(this);
    alerts.oneThingPerDay = alerts.oneThingPerDay.bind(this);
    this.handleCompleteThing = this.handleCompleteThing.bind(this);
    this.handleSkipThing = this.handleSkipThing.bind(this);
  }

  componentDidMount() {
    // DEV USE ONLY:
    // reset item status for testing
      // storage.store("lastCompletedThing", JSON.stringify(this.state.todaysThing));

    // get new thing on each load
      // things.getNewThing().then(thing => {
      //   this.setState({
      //     todaysThing: thing,
      //     completedThingToday: false
      //   });
      // });





    // set up daily notifications
    // notifications.configureNotifications();
    // notifications.scheduleNotifications();


    // things.init();

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
