import React, { Component } from "react";
import { View, Text } from "react-native";

import CompleteButton from "../completeButton/CompleteButton";

import { styles } from "./Thing.styles";

import {things, notifications, storage, tracker, alerts} from '../../core/factory.js';

class Thing extends Component {
  constructor() {
    super();

    this.state = things.getThing();
    
    alerts.cantDoThing = alerts.cantDoThing.bind(this);
    alerts.oneThingPerDay = alerts.oneThingPerDay.bind(this);
    this.handleCompleteThing = this.handleCompleteThing.bind(this);
    this.handleSkipThing = this.handleSkipThing.bind(this);
  }

  componentDidMount() {

    things.subscribe((thing) => {
      this.setState(thing);
    });
    
    // TODO: use debug config var or something

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
