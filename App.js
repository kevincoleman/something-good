import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Thing from "./components/thing/Thing";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Thing />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
