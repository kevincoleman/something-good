import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Thing from "./components/thing/Thing";
import { colors } from "./core/config";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: ""
    };
    this.colorChange = this.colorChange.bind(this);
  }

  colorChange() {
    const newColor = `#${colors[Math.floor(Math.random() * colors.length)]}`;
    this.setState({
      backgroundColor: newColor
    });
  }

  componentDidMount() {
    this.colorChange();
  }

  render() {
    return (
      <View
        style={{
          ...styles.container,
          backgroundColor: this.state.backgroundColor
        }}
      >
        <Thing colorChange={this.colorChange} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    paddingTop: 120,
    paddingBottom: 80
  }
});
