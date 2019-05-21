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

    // get new random thing from local storage

    // get all the things from API
    const things = await thingGateway.all();
    
    // store all the things into local storage
    await storage.store("allThings", JSON.stringify(things));

    // retrieve from local storage
    let localThings = JSON.parse(await storage.retrieve("allThings"));

    // get a random thing
    let thing = localThings[Math.floor(Math.random() * localThings.length)];

    // init the thing
    thing = this.initThing(thing);

    // put the thing in local storage
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
