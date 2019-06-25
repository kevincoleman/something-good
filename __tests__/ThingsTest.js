import { Things } from "../core/Things/Things.js";

import { MockThingGateway } from "../mocks/MockThingGateway.js";
import { MockStorage } from "../mocks/MockStorage.js";
import { MockTracker } from "../mocks/MockTracker.js";
import { MockNotifications } from "../mocks/MockNotifications.js";

describe('Things', () => {
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

    it('should initialize a given thing', () => {
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

    xit('should get a new thing', async () => {
        let newThing = await things.getNewThing();
        console.log(newThing);
        expect(newThing).toEqual();
    });

    // complete thing

    // skip thing

});