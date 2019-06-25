export class MockStorage {

  constructor() {
    this.mockStore = [];
  }

  async store(name, data) {
    // should intelligently update store based on name passed
    await this.mockStore.push({name: name, data: data});
  }
  async retrieve() {
    await this.mockStore.filter(name => {name == this.mockStore.name})[0];
  }
}