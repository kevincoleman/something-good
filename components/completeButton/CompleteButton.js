import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Encouragements } from "../../core/Encouragements";

import { styles } from "./CompleteButton.styles";
import { alerts, things } from "../../core/factory";
import ShareButton from "../shareButton/ShareButton";

class CompleteButton extends Component {

  constructor(props) {
    super(props);
    this.encouragements = new Encouragements();
  }

  cantDoThing() {
    alerts.cantDoThing();
  }

  handleCompleteThing() {
    things.completeThing();
  }

  render() {
    let incompleted = (
      <View style={styles.actionArea}>
        <TouchableOpacity
          style={styles.button}
          onPress={this.handleCompleteThing}
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
          {`${things.state.todaysThing.encouragement} `}
          Come back tomorrow for another good thing to do.
        </Text>
        <ShareButton />
      </View>
    );

    return !this.props.completed ? incompleted : completed;
  }
}

export default CompleteButton;
