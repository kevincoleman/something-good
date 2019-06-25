import { getRandomColor } from "../Config.js";
import { from } from 'rxjs'

export class Things {
  constructor(thingGateway, storage, tracker, notifications) {
    this.thingGateway = thingGateway;
    this.storage = storage;
    this.tracker = tracker;
    this.notifications = notifications;
    
    this.state = {
      todaysThing: {
        title: "",
        completed: false,
        dateRetrieved: "",
        dateCompleted: "",
        color: ""
      },
      completedThingToday: false
    };

    this.onThingChange = () => {};
  }

  subscribe(callback) {
    this.onThingChange = callback;
  }

  getThing() {
    return this.state;
  }

  update(state) {
    this.onThingChange(state);
  }
 

  async getNewThing() {

    // get all the things from API, local, defaults
    const things = await this.thingGateway.all();
    
    // store all the things into local storage
    await this.storage.store("allThings", JSON.stringify(things));

    // retrieve from local storage
    let localThings = JSON.parse(await this.storage.retrieve("allThings"));

    // get a random thing
    let thing = localThings[Math.floor(Math.random() * localThings.length)];

    // init the thing
    thing = this.initThing(thing);

    // put the thing in local storage
    await this.storage.store("todaysThing", JSON.stringify(thing));

    // track event in GA
    this.tracker.trackEvent("loadNewThing", { thing: thing });

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
    this.storage.store("lastCompletedThing", JSON.stringify(thing));

    // update & schedule notifications
    this.notifications.removeBadge();
    this.notifications.scheduleNotifications();

    // analytics
    this.tracker.trackEvent("completeThing", { thing: thing });
    return thing;
  }
}
