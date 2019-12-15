import { core } from "../core/factory.js";


describe("Core", () => {
  describe("init()", () => {
    fit("inits a fresh app with a new thing and notification", () => {
      let test = core.init();
      expect(test).toEqual(1);
    });
  });
});



// comment tests

// user hasn’t checked off thing and it’s 8am
  // core.init();
  // expect thing not to be completed
  // expect todaysThing in local storage to not be completed...
  // expect notifiction to be scheduled for 9am today

// // user hasn’t checked off thing and it’s 10am
  // core.init();  
  // expect thing not to be completed
  // expect notifiction to be scheduled for 9am tomorrow

// user has checked off thing and it’s 8am
  // core.init();
  // expect thing to be completed
  // expect notifiction to be scheduled for 9am tomorrow

// user has checked off thing and it’s 10am
  // core.init();
  // expect thing to be completed
  // expect notifiction to be scheduled for 9am tomorrow



// Thoughts/questions

// Should core be the place that coordinates UX state to all the other classes,
 // or should it be a single entry point from App.js?


// expect notifications

// core.completeThing();

// should things be referenced or should everything go through core?
  // core.things.completeThing()
  
  // What we have now
  // things.init()
  // notifications.init()
  // alerts.init()

  // Would it be?
  // core.initThings()
  // core.initNotifications()