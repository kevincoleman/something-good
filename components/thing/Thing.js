import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import goodThings from "./goodThings.js";
import encouragement from "./encouragement.js";

class Thing extends Component {
  constructor() {
    super();
    this.state = {
      todaysThing: {
        title: "",
        completed: false
      }
    };
  }

  componentWillMount() {
    const thing = goodThings[Math.floor(Math.random() * goodThings.length)];
    this.setState({
      todaysThing: { title: thing.title, completed: false, id: thing.id }
    });
  }

  handleCompleteThing() {
    this.setState({
      todaysThing: { title: this.state.todaysThing.title, completed: true }
    });
  }

  render() {
    let actionArea;
    if (!this.state.todaysThing.completed) {
      actionArea = (
        <TouchableOpacity
          style={styles.button}
          onPress={this.handleCompleteThing.bind(this)}
        >
          <Text style={styles.buttonText}>I did it!</Text>
        </TouchableOpacity>
      );
    } else {
      actionArea = (
        <Text style={styles.basicText}>
          {encouragement[Math.floor(Math.random() * encouragement.length)] +
            " "}
          Come back tomorrow for another good thing to do.
        </Text>
      );
    }

    return (
      <View style={styles.container}>
        <Text
          style={
            this.state.todaysThing.completed
              ? styles.completedThing
              : styles.todaysThing
          }
        >
          {this.state.todaysThing.title}
        </Text>
        {actionArea}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  todaysThing: {
    fontSize: 44,
    color: "#ffffff"
  },
  completedThing: {
    fontSize: 44,
    color: "rgba(255, 255, 255, 0.8)",
    textDecorationLine: "line-through"
  },
  button: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 3
  },
  buttonText: {
    fontSize: 24,
    color: "#333333"
  },
  basicText: {
    color: "#ffffff",
    fontSize: 18
  }
});

export default Thing;
