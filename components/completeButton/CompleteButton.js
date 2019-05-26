import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { getRandomEncouragement } from "../../core/Config";
import RNShake from "react-native-shake";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

import { styles } from "./CompleteButton.styles";

class CompleteButton extends Component {
  alertPresent = false;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Handle shake events
    RNShake.addEventListener("ShakeEvent", () => {
      if (this.alertPresent) {
        return false;
      }
      if (!this.props.completed) {
        this.props.cantDoThing(this);
      } else {
        this.props.oneThingPerDay(this);
      }
      ReactNativeHapticFeedback.trigger("impactLight", true);
    });
  }

  render() {
    let incompleted = (
      <View style={styles.actionArea}>
        <TouchableOpacity
          style={styles.button}
          onPress={this.props.handleCompleteThing.bind(this)}
        >
          <Text style={styles.buttonText}>I did it!</Text>
        </TouchableOpacity>
        <Text style={styles.cantDo} onPress={this.props.cantDoThing}>
          I can’t do that thing today.
        </Text>
      </View>
    );
    let completed = (
      <View style={styles.actionArea}>
        <Text style={styles.basicText}>
          {getRandomEncouragement() + " "}
          Come back tomorrow for another good thing to do.
        </Text>
      </View>
    );

    return !this.props.completed ? incompleted : completed;
  }
}

export default CompleteButton;
