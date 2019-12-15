import { Colors } from "../Colors.js";
import { Encouragements } from "../Encouragements.js";

export class Things {
  constructor(thingGateway, storage, tracker, notifications) {
    this.colors = new Colors();
    this.encouragements = new Encouragements();
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
        color: "",
        encouragement: "",
      },
      hidden: false,
    };

    this.colors = new Colors();
    this.onThingChange = () => {};
  }

  subscribe(callback) {
    this.onThingChange = callback;
  }

  update(state) {
    this.state = state;
    this.onThingChange(state);
  }

  getThing() {
    this.update({ todaysThing: this.state.todaysThing, hidden: true });
    setTimeout( async () => {
      const things = await this.thingGateway.all();
      await this.storage.store("allThings", JSON.stringify(things));
      let localThings = JSON.parse(await this.storage.retrieve("allThings"));
      let thing = localThings[Math.floor(Math.random() * localThings.length)];
      thing = this.initThing(thing);
      await this.storage.store("todaysThing", JSON.stringify(thing));
      this.update({ todaysThing: thing, hidden: false });
    }, 1000);

  }

  async skipThing() {
    this.tracker.trackEvent(
      "skip_thing",
      this.state.todaysThing,
    );
    await this.getThing();
  }
 

  async getNewThing() {
    const thing = await this.getThing();
    this.tracker.trackEvent(
      "load_new_thing",
      thing
    );
    return thing;
  }

  initThing(thing) {
    return {
      title: thing.title,
      completed: false,
      dateRetrieved: new Date().toDateString(),
      color: `#${this.colors.getRandom()}`,
      encouragement: this.encouragements.getRandom(),
      id: thing.id,
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
    this.notifications.scheduleNotifications(true);

    // analytics
    this.tracker.trackEvent(
      "complete_thing",
      this.state.todaysThing
    );
    
    this.update({todaysThing: this.state.todaysThing});
  }
}
