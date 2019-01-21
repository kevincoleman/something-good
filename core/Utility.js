export default class Utility {
  getNextMorning() {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    now.setHours(9);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  }

  colors = [
    "442B48",
    "6320EE",
    "D81E5B",
    "F15152",
    "66635B",
    "A4036F",
    "16DB93",
    "F29E4C"
  ];
}
