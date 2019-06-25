import { getRandomColor } from "../Config.js";

export class Things {
  constructor(thingGateway, storage, tracker, notifications) {
    this.thingGateway = thingGateway;
    this.storage = storage;
    this.tracker = tracker;
    this.notifications = notifications;
    
    this.state = {
      todaysThing: {
        title: "hi",
        completed: false,
        dateRetrieved: "",
        dateCompleted: "",
        color: ""
      }
    };

    this.onThingChange = () => {};
  }

  subscribe(callback) {
    this.onThingChange = callback;
  }

  update(state) {
    this.state = state;
    this.onThingChange(state);
  }

  async getThing() {
    const things = await this.thingGateway.all();
    await this.storage.store("allThings", JSON.stringify(things));
    let localThings = JSON.parse(await this.storage.retrieve("allThings"));
    let thing = localThings[Math.floor(Math.random() * localThings.length)];
    thing = this.initThing(thing);
    await this.storage.store("todaysThing", JSON.stringify(thing));
    this.update({todaysThing: thing});
  }

  async skipThing() {
    this.tracker.trackEvent("skipThing", { thing: this.state.todaysThing });
    await this.getThing();
  }
 

  async getNewThing() {
    const thing = await this.getThing();
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

  completeThing() {
    // update thing state
    this.state.todaysThing.completed = true;
    this.state.todaysThing.dateCompleted = new Date().toDateString();

    // update local storage
    this.storage.store("lastCompletedThing", JSON.stringify(this.state.todaysThing));

    // update & schedule notifications
    this.notifications.removeBadge();
    this.notifications.scheduleNotifications();

    // analytics
    this.tracker.trackEvent("completeThing", { thing: this.state.todaysThing });
    
    this.update({todaysThing: this.state.todaysThing});
  }
}
