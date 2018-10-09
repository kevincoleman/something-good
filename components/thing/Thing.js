import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

class Thing extends Component {
  constructor() {
    super();
    this.state = {
      things: [
        { title: "Smile at someone", id: 0 },
        { title: "Say something nice", id: 1 },
        { title: "Listen to someone intently", id: 2 },
        { title: "Write someone an enouraging note or text", id: 3 },
        { title: "Give a gift", id: 4 },
        { title: "Check in on someone who looks up to you", id: 5 },
        { title: "Donate to a good cause", id: 6 }
      ],
      newThing: {
        title: "",
        id: null
      }
    };
  }

  handleChangeThing(text) {
    this.setState({ newThing: { title: text, id: this.state.newThing.id } });
  }

  handleAddThing() {
    // keep blanks from submitting
    if (this.state.newThing.title == "") {
      console.warn("Nothing typed in to add");
      return false;
    }

    let nextId = this.state.newThing.id;
    this.state.things.forEach(thing => {
      if (thing.id > nextId) {
        nextId = thing.id;
      }
    });
    nextId++;

    this.setState({
      things: [...this.state.things, this.state.newThing],
      newThing: { title: "", id: nextId ? nextId : "hah" }
    });
  }

  render() {
    return (
      <View style="styles.container">
        <TextInput
          placeholder="New Thing"
          value={this.state.newThing.title}
          onChangeText={this.handleChangeThing.bind(this)}
        />
        <TouchableOpacity onPress={this.handleAddThing.bind(this)}>
          <Text>Add thing</Text>
        </TouchableOpacity>
        {this.state.things.map(thing => (
          <Text key={thing.id} style={styles.thingText}>
            {thing.title}
          </Text>
        ))}
      </View>
    );
  }
}

const styles = {
  thingText: {
    //
  }
};

export default Thing;
