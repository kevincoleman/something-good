export class MockStorage {

  constructor() {
    this.mockStore = [];
  }

  async store(name, data) {
    // should intelligently update store based on name passed
    await this.mockStore.push({name: name, data});
  }
  async retrieve(name) {
    return this.mockStore.filter(item => item.name == name)[0].data;
  }
}