import { getRandomColor } from "../Config.js";

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

    // get all the things
    const things = await this.thingGateway.all();

    // store all the things locally
    await this.storage.store("allThings", JSON.stringify(things));

    // get all the things from local storage
    let localThings = JSON.parse(await this.storage.retrieve("allThings"));

    // get one random thing from the things we have stored locally
    let thing = localThings[Math.floor(Math.random() * localThings.length)];

    // initialize the thing for use in the app
    thing = this.initThing(thing);

    // store todays thing in local storage
    await this.storage.store("todaysThing", JSON.stringify(thing));

    // fire an update for the UI to reac
    this.update({todaysThing: thing});

    // should return true if a thing was gotten, and false if it failed?

    // return for testing?
    return thing;
  }

  async skipThing() {
    this.tracker.trackEvent(
      "skipThing",
      { thing: JSON.stringify(this.state.todaysThing) }
    );
    await this.getThing();
  }
 

  async getNewThing() {
    const thing = await this.getThing();
    this.tracker.trackEvent(
      "loadNewThing",
      { thing: JSON.stringify(thing) }
    );
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
    this.tracker.trackEvent(
      "completeThing",
      { thing: JSON.stringify(this.state.todaysThing) }
    );
    
    this.update({todaysThing: this.state.todaysThing});
  }
}
