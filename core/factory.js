import { Platform } from "react-native";
import { ThingGateway } from "./Things/ThingGateway.js";
import { Things } from "./Things/Things.js";
import { Storage } from "./Storage.js";
import { Tracker } from "./Tracker.js";
import { getRandomColor, getRandomEncouragement } from "./Config.js";
import { Notifications } from "./Notifications.js";
import { Alerts } from "./Alerts.js";
import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";


export const color = getRandomColor();
export const encouragement = getRandomEncouragement();
export const storage = new Storage();
export const thingGateway = new ThingGateway(storage);
export const tracker = new Tracker(new GoogleAnalyticsTracker("UA-127958837-1"));
export const notifications = new Notifications(storage, Platform.OS);
export const alerts = new Alerts();
export const things = new Things(thingGateway, storage, tracker, notifications);
