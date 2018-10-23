import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Storage } from "../../services/storage";
import encouragement from "./encouragement.js";
import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";

const tracker = new GoogleAnalyticsTracker("UA-127958837-1");
const storage = new Storage();

class Thing extends Component {
  constructor() {
    super();
    this.state = {
      todaysThing: {
        title: "",
        completed: false,
        dateRetrieved: "",
        dateCompleted: ""
      }
    };
  }

  today() {
    const today = new Date();
    return today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
  }

  componentWillMount() {
    // TEMPORARY: reset item status for testing
    // storage.store("lastCompletedThing", JSON.stringify(this.state.todaysThing));

    let lastCompleted = {};
    storage.retrieve("lastCompletedThing").then(thing => {
      lastCompleted = JSON.parse(thing);

      // check if the user already did today’s thing
      if (
        lastCompleted.dateCompleted !== "" &&
        lastCompleted.dateCompleted == this.today()
      ) {
        // don’t get a new item, just use the completed one
        this.setState({ todaysThing: lastCompleted });
      } else {
        // if they haven’t completed today’s thing yet, check if today’s thing has already been set
        storage.retrieve("todaysThing").then(todaysThing => {
          if (
            todaysThing !== undefined &&
            JSON.parse(todaysThing).dateRetrieved == this.today()
          ) {
            this.setState({ todaysThing: JSON.parse(todaysThing) });
          } else {
            this.getNewThing();
          }
        });
      }
    });
  }

  getNewThing() {
    tracker.trackEvent("activity", "load new thing");
    fetch("https://things.somethinggood.app/goodThings.json", {
      Accept: "application/json"
    })
      .then(res => res.json())
      .then(things => {
        const thing = things[Math.floor(Math.random() * things.length)];
        const todaysThing = {
          title: thing.title,
          completed: false,
          dateRetrieved: this.today(),
          id: thing.id
        };
        storage.store("todaysThing", JSON.stringify(todaysThing));
        this.setState({
          todaysThing: todaysThing
        });
      });
  }

  handleCompleteThing() {
    const completedThing = {
      title: this.state.todaysThing.title,
      completed: true,
      dateCompleted: this.today()
    };
    tracker.trackEvent("completed", JSON.stringify(completedThing));
    storage.store("lastCompletedThing", JSON.stringify(completedThing));
    this.setState({ todaysThing: completedThing });
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
