import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage
} from "react-native";
import encouragement from "./encouragement.js";

class Thing extends Component {
  constructor() {
    super();
    this.state = {
      todaysThing: {
        title: "",
        completed: false,
        dateCompleted: ""
      }
    };
  }

  today() {
    const today = new Date();
    return today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
  }

  componentWillMount() {
    let lastCompleted = {};
    this.retrieveCompletedThing().then(thing => {
      lastCompleted = JSON.parse(thing);

      // check if the user already did today’s thing
      if (
        lastCompleted.dateCompleted !== "" &&
        lastCompleted.dateCompleted == this.today()
      ) {
        // don’t get a new item, just use the completed one
        this.setState({ todaysThing: lastCompleted });
      } else {
        // if they haven’t completed today’s thing yet, get a random thing
        this.getNewThing();
      }
    });
  }

  storeCompletedThing = async function(thing) {
    thing = JSON.stringify(thing);
    try {
      await AsyncStorage.setItem("@lastCompletedThing", thing);
    } catch (error) {
      console.error(error);
    }
  };

  retrieveCompletedThing = async function() {
    try {
      const value = await AsyncStorage.getItem("@lastCompletedThing");
      if (value !== null) {
        return value;
      }
    } catch (error) {
      console.error(error);
    }
  };

  getNewThing() {
    let goodThings = [];
    fetch("https://things.somethinggood.app/goodThings.json", {
      Accept: "application/json"
    })
      .then(res => res.json())
      .then(data => {
        goodThings = data;
        const thing = goodThings[Math.floor(Math.random() * goodThings.length)];
        this.setState({
          todaysThing: {
            title: thing.title,
            completed: false,
            id: thing.id
          }
        });
      });
  }

  handleCompleteThing() {
    const completedThing = {
      title: this.state.todaysThing.title,
      completed: true,
      dateCompleted: this.today()
    };
    this.storeCompletedThing(completedThing);
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
