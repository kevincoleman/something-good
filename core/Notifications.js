import { things } from "./factory";

let PushNotification = require("react-native-push-notification");

function getMorning(modifier) {
  const now = new Date();
  now.setDate(now.getDate() + modifier);
  now.setHours(9);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);
  return now;
}

export class Notifications {
  constructor(os) {
    this.os = os;
  }

  configureNotifications() {
    PushNotification.configure({
      onNotification: function(notification) {
        if (this.os === "ios") {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      }
    });
  }

  cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  scheduleNotifications() {
    
    let nextTime;

    PushNotification.cancelAllLocalNotifications();

    if (things.state.todaysThing.completed) {
      nextTime = getMorning(1);
    } else if (new Date().getHours() < 9) {
      nextTime = getMorning(0);
    } else {
      nextTime = getMorning(1);
    }

    PushNotification.localNotificationSchedule({
      message: "Remember to do something good today",
      number: "1",
      repeatType: "day",
      date: nextTime
    });
  }

  addBadge() {
    PushNotification.setApplicationIconBadgeNumber(1);
  }

  removeBadge() {
    PushNotification.setApplicationIconBadgeNumber(0);
  }
}
