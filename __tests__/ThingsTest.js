import { Things } from "../core/Things/Things.js";

import { MockThingGateway } from "../mocks/MockThingGateway.js";
import { MockStorage } from "../mocks/MockStorage.js";
import { MockTracker } from "../mocks/MockTracker.js";
import { MockNotifications } from "../mocks/MockNotifications.js";

describe("Things", () => {
  let things;
  let thingGateway;
  let storage;
  let tracker;
  let notifications;

  beforeEach(() => {
    thingGateway = new MockThingGateway();
    storage = new MockStorage();
    tracker = new MockTracker();
    notifications = new MockNotifications();
    things = new Things(thingGateway, storage, tracker, notifications);
  });

  describe("getThing()", () => {
    it("should...", () => {
      // ...
    })
  });

  describe("skipThing()", () => {
    it("should track the last thing as a 'skipThing' event", () => {
      things.state.todaysThing = thingGateway.all()[0];
      spyTracker = jest.spyOn(tracker, "trackEvent");

      things.skipThing();

      expect(spyTracker).toHaveBeenCalledWith("skipThing", { thing: things.state.todaysThing });
    })

    it("should try to get a new thing", async () => {
      spyGetNewThing = jest.spyOn(things, "getThing");

      things.skipThing();
      expect(spyGetNewThing).toHaveBeenCalledTimes(1);
    })
  });

  describe("getNewThing()", () => {
    it("should set a new thing in app state", async () => {
      things.state.todaysThing = thingGateway.all()[0];
      things.state.todaysThing.title = "oldThing";
      expect(things.state.todaysThing.title).toEqual("oldThing");
      
      await things.getNewThing();
      expect(things.state.todaysThing.title).not.toEqual("");
      expect(things.state.todaysThing.title).not.toEqual("oldThing");
    });
  })

  describe("initThing()", () => {
    it("should initialize a given thing", () => {
      let thing = thingGateway.all()[0]; 
      expect(thing.title).toEqual("Smile at someone.");
      expect(thing.completed).toBe(undefined);
      expect(thing.dateRetrieved).toBe(undefined);
      expect(thing.color).toBe(undefined);
      expect(thing.id).toEqual(0);
  
      thing = things.initThing(thing);
      expect(thing.title).toEqual("Smile at someone.");
      expect(thing.completed).toEqual(false);
      expect(thing.dateRetrieved).toEqual(new Date().toDateString());
      expect(thing.color).toMatch(/^#+[a-fA-F0-9]+$/);
      expect(thing.id).toEqual(0);
    })
  })

  describe("completeThing()", () => {
    it("completeThing() should complete today’s thing", () => {
      // setup
      let thing = thingGateway.all()[0];
      thing = things.initThing(thing);
      things.state.todaysThing = thing;
      expect(things.state.todaysThing.completed).toEqual(false);
  
      things.completeThing();
      expect(things.state.todaysThing.completed).toEqual(true);
    })
  })

});