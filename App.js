/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Thing from "./components/thing/Thing";
import Utility from "./core/Utility";

const utility = new Utility();

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
    backgroundColor: `#${
      utility.colors[Math.floor(Math.random() * utility.colors.length)]
    }`
  }
});