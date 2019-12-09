import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { getRandomEncouragement } from "../../core/Config";

import { styles } from "./CompleteButton.styles";
import { alerts } from "../../core/factory";
import ShareButton from "../shareButton/ShareButton";

class CompleteButton extends Component {

  constructor(props) {
    super(props);
  }

  cantDoThing() {
    alerts.cantDoThing();
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
        <Text style={styles.cantDo} onPress={this.cantDoThing}>
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
        <ShareButton />
      </View>
    );

    return !this.props.completed ? incompleted : completed;
  }
}

export default CompleteButton;
