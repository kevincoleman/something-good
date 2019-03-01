import { ThingGateway } from "./ThingGateway.js";
import { Storage } from "../Storage";
import Tracker from "../Tracker";

const thingGateway = new ThingGateway();
const storage = new Storage();
const tracker = new Tracker();

export default class Things {
  constructor(thingGateway, storage, tracker) {
    this.thingGateway = thingGateway;
    this.storage = storage;
    this.tracker = tracker;
  }

  async getNewThing() {
    // handle new thing
    const things = await thingGateway.all();
    let thing = things[Math.floor(Math.random() * things.length)];
    thing = this.initThing(thing);
    await storage.store("todaysThing", JSON.stringify(thing));

    // track event in GA
    tracker.trackEvent("loadNewThing", { thing: thing });

    console.warn("get a new color");
    return thing;
  }

  getViewData() {
    return {
      todaysThing: {},
      encouragement: ""
    };
  }

  initThing(thing) {
    return {
      title: thing.title,
      completed: false,
      dateRetrieved: new Date().toDateString(),
      id: thing.id
    };
  }

  completeThing(thing) {}
}
