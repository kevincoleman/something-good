import Utility from "./Utility";
let PushNotification = require("react-native-push-notification");
const utility = new Utility();

export default class Notifications {
  constructor() {}

  configureNotifications() {
    PushNotification.configure({
      onNotification: function(notification) {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      }
    });
  }

  scheduleNotifications() {
    PushNotification.cancelAllLocalNotifications();
    PushNotification.localNotificationSchedule({
      message: "Remember to do something good today",
      number: "1",
      repeatType: "day",
      date: utility.getNextMidnight()
    });
  }

  addBadge() {
    PushNotification.setApplicationIconBadgeNumber(1);
  }

  removeBadge() {
    PushNotification.setApplicationIconBadgeNumber(0);
  }

  initBadge(completed) {
    if (completed) {
      this.removeBadge();
    } else {
      this.addBadge();
    }
  }
}
