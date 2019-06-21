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
      },
      completedThingToday: false
    };
  }


  getThing() {
    return this.state;
  }

  init() {
    let lastCompleted = {};
    storage
      .retrieve("lastCompletedThing")
      .then(thing => {
        lastCompleted = JSON.parse(thing);
        if (
          lastCompleted &&
          lastCompleted.dateCompleted !== "" &&
          lastCompleted.dateCompleted == new Date().toDateString()
        ) {
          // user did today’s thing: just use that thing
          notifications.removeBadge();
          this.state = {
            todaysThing: lastCompleted,
            completedThingToday: true
          }
          this.setState({
            todaysThing: lastCompleted,
            completedThingToday: true
          });
        } else {
          // user didn’t do today’s thing: check if thing is already set
          notifications.addBadge();
          storage
            .retrieve("todaysThing")
            .then(todaysThing => {
              if (
                todaysThing === null ||
                JSON.parse(todaysThing).dateRetrieved !==
                  new Date().toDateString()
              ) {
                // today’s thing hasn’t been set: set it.
                let thing = things.getNewThing().then(thing => {
                  this.setState({
                    todaysThing: thing,
                    thingCompletedToday: false
                  });
                });
              } else {
                // today’s thing has been set: use it.
                this.setState({ todaysThing: JSON.parse(todaysThing) });
              }
            })
            .catch(error => {
              things.getNewThing().then(thing => {
                this.setState({
                  todaysThing: thing,
                  completedThingToday: false
                });
              });
              console.error(error);
            });
        }
      })
      .catch(error => {
        console.error(error);
      });
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
