import { ThingGateway } from "./ThingGateway.js";
import { Storage } from "../Storage";
import { Tracker } from "../Tracker";
import { Notifications } from "../Notifications.js";
import { getRandomColor } from "../Config.js";

const thingGateway = new ThingGateway();
const storage = new Storage();
const tracker = new Tracker();
const notifications = new Notifications();

export class Things {
  constructor(thingGateway, storage, tracker) {
    this.thingGateway = thingGateway;
    this.storage = storage;
    this.tracker = tracker;
    this.notifications = notifications;
  }

  async getNewThing() {
    // handle new thing
    const things = await thingGateway.all();
    let thing = things[Math.floor(Math.random() * things.length)];
    thing = this.initThing(thing);
    await storage.store("todaysThing", JSON.stringify(thing));

    // track event in GA
    tracker.trackEvent("loadNewThing", { thing: thing });

    return thing;
  }

  initThing(thing) {
    return {
      title: thing.title,
      completed: false,
      dateRetrieved: new Date().toDateString(),
      color: `#${getRandomColor()}`,
      id: thing.id
    };
  }

  completeThing(thing) {
    // update thing state
    thing.completed = true;
    thing.dateCompleted = new Date().toDateString();

    // udpate local storage
    storage.store("lastCompletedThing", JSON.stringify(thing));

    // update & schedule notifications
    notifications.removeBadge();
    notifications.scheduleNotifications();

    // analytics
    tracker.trackEvent("completeThing", { thing: thing });
    return thing;
  }
}
