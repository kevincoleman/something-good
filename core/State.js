import { thingGateway } from "./factory";


// App State
  // * Synced to Local Storage

  // Thing (full json)
  // Thing status (completed / incomplete)
  // Completed thing today (boolean)
  // Last thing Completed (full json)
  // Alert currently showing (boolean)
  // Notifications (array of notification config objects)




// Layers

// - Core libraries - factory includes core
  // - Storage 
  // - Things.js - (main operating space)
// - UI - Thing.js (component) <-- main thread


// Nathan’s Suggestion

class Things {

  subscribe(onChangeHandler) {
    this.onChangeHandler = onChangeHandler;
  }
  
  complete(done) {
    // complete thing...
    
    this.onChangeHandler(this.thing);    
  }

  skip(done) {

  }
}

const things = new Things();

// onThingChange
things.subscribe((thing) => {
  this.setState(thing);
});

// start/init
things.boot();

things.complete();


// Kevin’s Suggestion
/*
core
  app.js (logic flow from thing.js)
  state.js (for managing global or namespaced state)
  storage.js (for managing local storage, which all gets passed through state.js)
  things.js (interface for handling thing objects)
  notifications.js
  alerts.js
  settings.js...
ui
  react
    app
      thing
      button
      settings...
*/