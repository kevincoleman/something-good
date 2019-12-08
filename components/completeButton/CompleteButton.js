import React, { Component } from "react";
import { View, Text, Share, TouchableOpacity } from "react-native";
import { getRandomEncouragement } from "../../core/Config";

import { styles } from "./CompleteButton.styles";
import { alerts } from "../../core/factory";

class CompleteButton extends Component {

  constructor(props) {
    super(props);

  }

  cantDoThing() {
    alerts.cantDoThing();
  }

  onShare = async () => {
    try {
      const result = Share.share({
        message: 'I just did a good thing!'
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType){
          // shared with an activity type
        } else {
          // just shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
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
        <TouchableOpacity
          style={styles.shareButton}>
          <Text style={styles.shareButtonText}
            onPress={this.onShare}>
            Share the goodness
          </Text>
        </TouchableOpacity>
      </View>
    );

    return !this.props.completed ? incompleted : completed;
  }
}

export default CompleteButton;
