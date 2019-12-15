import { Platform } from "react-native";
import { Core } from "./Core.js";
import { ThingGateway } from "./Things/ThingGateway.js";
import { Things } from "./Things/Things.js";
import { Storage } from "./Storage.js";
import { Tracker } from "./Tracker.js";
import { Encouragements } from "./Encouragements.js";
import { Colors } from "./Colors.js"
import { Notifications } from "./Notifications.js";
import { Alerts } from "./Alerts.js";

export const tracker = new Tracker();
export const colors = new Colors();
export const encouragemnents = new Encouragements();
export const storage = new Storage(tracker);
export const notifications = new Notifications(Platform.OS);
export const thingGateway = new ThingGateway(storage, tracker);
export const things = new Things(thingGateway, storage, tracker, notifications);
export const alerts = new Alerts(things, tracker);
export const core = new Core(storage, notifications, things, tracker);
