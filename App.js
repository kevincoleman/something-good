import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Thing from "./components/thing/Thing";
import { core, notifications } from "./core/factory.js";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    notifications.configureNotifications();
    notifications.scheduleNotifications(false);
    core.init();
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
