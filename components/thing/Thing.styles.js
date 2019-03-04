import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "purple"
  },
  todaysThing: {
    fontSize: 44,
    paddingTop: 100,
    color: "#ffffff"
  },
  completedThing: {
    fontSize: 44,
    paddingTop: 100,
    paddingBottom: 40,
    color: "rgba(255, 255, 255, 0.8)",
    textDecorationLine: "line-through"
  }
});
