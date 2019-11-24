import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Thing from "./components/thing/Thing";
import { core, notifications } from "./core/factory.js";
import analytics from '@react-native-firebase/analytics';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    notifications.configureNotifications();
    notifications.scheduleNotifications();
    core.init();
 
    async function onProductView() {
      await analytics().logEvent('product_view', {
        id: '123456789',
        color: 'red',
        via: 'ProductCatalog',
      });
    }

    onProductView();
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
