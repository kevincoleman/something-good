/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Thing from "./components/thing/Thing";

// const instructions = Platform.select({
//   ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
//   android:
//     "Double tap R on your keyboard to reload,\n" +
//     "Shake or press menu button for dev menu"
// });

// type Props = {};
const colors = [
  "442B48",
  "6320EE",
  "D81E5B",
  "F15152",
  "66635B",
  "A4036F",
  "16DB93",
  "F29E4C"
];

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Thing />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    paddingTop: 120,
    paddingBottom: 80,
    backgroundColor: `#${colors[Math.floor(Math.random() * colors.length)]}`
  }
});
