export class Core {
  constructor(storage, notifications, things, tracker) {
    this.storage = storage;
    this.notifications = notifications;
    this.things = things;
    this.tracker = tracker;
  }
  init() {
    let lastCompleted = {};
    this.storage
      .retrieve("lastCompletedThing")
      .then(thing => {
        lastCompleted = JSON.parse(thing);
        if (
          lastCompleted &&
          lastCompleted.dateCompleted !== "" &&
          lastCompleted.dateCompleted == new Date().toDateString()
        ) {
          // user did today’s thing: just use that thing
          this.notifications.removeBadge();
          this.things.update({
            todaysThing: lastCompleted
          });
        } else {
          // user didn’t do today’s thing: check if thing is already set
          this.notifications.addBadge();
          this.storage
            .retrieve("todaysThing")
            .then(todaysThing => {
              if (
                todaysThing === null ||
                JSON.parse(todaysThing).dateRetrieved !==
                  new Date().toDateString()
              ) {
                // today’s thing hasn’t been set: set it.
                // thingsGateway.checkForNew() if there are new things, then update the store, then... 
                this.things.getNewThing();
              } else {
                // today’s thing has been set: use it.
                this.things.update({
                  todaysThing: JSON.parse(todaysThing),
                  thingCompletedToday: false,
                })
              }
            })
            .catch(error => {
              this.tracker.trackEvent(
                "error",
                { source: "App.js:init()", description: "failed to get new thing during init." }
              );
              this.things.getNewThing();
              console.error(error);
            });
        }
      })
      .catch(error => {
        this.tracker.trackEvent(
          "error",
          { source: "App.js:init()", description: "failed to access local storage in init." }
        );
        console.error(error);
      });
  }

}