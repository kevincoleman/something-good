export class MockTracker {

  trackEvent(name, data) {
    console.log(`trackEvent(${name}, ${data}) called`);
  }

}