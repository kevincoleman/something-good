import React, { Component } from "react";
import { View, Text } from "react-native";
import RNShake from "react-native-shake";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import {things} from '../../core/factory'

import CompleteButton from "../completeButton/CompleteButton";

import { styles } from "./Thing.styles";

class Thing extends Component {
  constructor(props) {
    super(props);
    
    this.state = things.state;
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
      // import { storage } from '../../core/factory.js';
      // things.getNewThing();
      // storage.store("lastCompletedThing", JSON.stringify(things));

          // Handle shake events
    RNShake.addEventListener("ShakeEvent", () => {
      if (alerts.state.alertPresent) {
        return false;
      }
      if (!things.state.todaysThing.completed) {
        alerts.cantDoThing();
      } else {
        alerts.oneThingPerDay();
      }
      ReactNativeHapticFeedback.trigger("impactLight", true);
    });
  }

  componentWillUnmount() {
    RNShake.removeEventListener('ShakeEvent');
  }

  handleSkipThing() {
    things.skipThing();
  }

  handleCompleteThing() {
    things.completeThing();
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
        />
      </View>
    );
  }
}

export default Thing;
