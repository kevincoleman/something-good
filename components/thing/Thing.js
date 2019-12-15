import React, { Component } from "react";
import { View, Text } from "react-native";
import RNShake from "react-native-shake";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { colors, things, alerts, storage } from '../../core/factory.js'

import CompleteButton from "../completeButton/CompleteButton.js";

import { styles } from "./Thing.styles.js";

class Thing extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      ...things.state,
      backdropColor: colors.getRandom(),
    };
    this.show = this.show.bind(this);
    this.changeBackdropColor = this.changeBackdropColor.bind(this);
    this.rando = this.rando.bind(this);
    this.hide = this.hide.bind(this);
  }

  show() {
    this.setState({ hidden: false });
  }

  hide() {
    this.setState({ hidden: true });
  }

  changeBackdropColor(last) {
    const color = colors.getRandom();
    if(last == color) {
      this.changeBackdropColor()
    } else {
      this.setState({ backdropColor: color });
    }
  }

  rando() {
    setInterval(() => {
      if (this.state.hidden) {
        this.changeBackdropColor(this.state.backdropColor);
      }
    }, 100);
  }

  componentDidMount() {
    this.rando();
    things.subscribe((thing) => {
      this.setState(thing);
    });

    // TODO: use debug config var or something

    // DEV USE ONLY:
    // reset item status for testing
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

  render() {
    return (
      <View
        style={[
          styles.backdrop,
          { backgroundColor: `#${this.state.backdropColor}` },
        ]}>
        <View
        style={[
          styles.container,
          { display: this.state.hidden ? "none" : "flex" },
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
        />
      </View>
      </View>
    );
  }
}

export default Thing;
