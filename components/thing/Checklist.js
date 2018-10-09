import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

class Thing extends Component {
  constructor() {
    super();
    this.state = {
      allTheThings: [],
      todaysThing: {
        title: "",
        completed: false
      }
    };
  }

  componentWillMount() {
    fetch("http://goodthings.kevincoleman.io/data.json", {
      Accept: "application/json"
    })
      .then(res => res.json())
      .then(data => {
        const thingForToday = data[Math.floor(Math.random() * data.length)];
        this.setState({ allTheThings: data, todaysThing: thingForToday });
      });
  }

  handleCompleteThing() {
    this.setState({
      todaysThing: { title: this.state.todaysThing.title, completed: true }
    });
  }

  render() {
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
        <TouchableOpacity
          style={styles.button}
          onPress={this.handleCompleteThing.bind(this)}
        >
          <Text style={styles.buttonText}>I did it!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  todaysThing: {
    fontSize: 26,
    color: "#ffffff"
  },
  completedThing: {
    fontSize: 26,
    color: "rgba(255, 255, 255, 0.8)",
    textDecorationLine: "line-through"
  },
  button: {
    alignItems: "center",
    padding: 10,
    marginTop: 15,
    backgroundColor: "#ffffff"
  },
  buttonText: {
    color: "#333333"
  },
  basicText: {
    color: "#ffffff"
  }
});

export default Thing;
