export default class Utility {
  getToday() {
    const today = new Date();
    return today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
  }
}
