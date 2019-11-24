import { Platform } from "react-native";
import { Core } from "./Core.js";
import { ThingGateway } from "./Things/ThingGateway.js";
import { Things } from "./Things/Things.js";
import { Storage } from "./Storage.js";
import { Tracker } from "./Tracker.js";
import { getRandomColor, getRandomEncouragement } from "./Config.js";
import { Notifications } from "./Notifications.js";
import { Alerts } from "./Alerts.js";


export const tracker = new Tracker();
export const color = getRandomColor();
export const encouragement = getRandomEncouragement();
export const storage = new Storage(tracker);
export const thingGateway = new ThingGateway(storage, tracker);
export const notifications = new Notifications(Platform.OS);
export const alerts = new Alerts();
export const things = new Things(thingGateway, storage, tracker, notifications);
export const core = new Core(storage, notifications, things, tracker);
