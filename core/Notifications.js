import { Platform } from "react-native";
import Utility from "./Utility";
import { Storage } from "../services/storage";

let PushNotification = require("react-native-push-notification");
const utility = new Utility();
const storage = new Storage();

export default class Notifications {
  constructor() {}

  configureNotifications() {
    PushNotification.configure({
      onNotification: function(notification) {
        if (Platform.OS === "ios") {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      }
    });
  }

  cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  scheduleNotifications() {
    let completed;
    let nextTime;

    PushNotification.cancelAllLocalNotifications();

    storage.retrieve("lastCompletedThing").then(thing => {
      lastCompleted = JSON.parse(thing);
      if (
        lastCompleted &&
        lastCompleted.dateCompleted !== "" &&
        lastCompleted.dateCompleted == new Date().toDateString()
      ) {
        completed = true;
      } else {
        completed = false;
      }

      if (completed) {
        nextTime = utility.getMorning(1);
      } else if (new Date().getHours() < 9) {
        nextTime = utility.getMorning(0);
      } else {
        nextTime = utility.getMorning(1);
      }

      PushNotification.localNotificationSchedule({
        message: "Remember to do something good today",
        number: "1",
        repeatType: "day",
        date: nextTime
      });
    });
  }

  addBadge() {
    PushNotification.setApplicationIconBadgeNumber(1);
  }

  removeBadge() {
    PushNotification.setApplicationIconBadgeNumber(0);
  }
}
