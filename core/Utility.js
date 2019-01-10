export default class Utility {
  getToday() {
    const now = new Date();
    // console.warn(today.toISOString());
    return now.getFullYear() + "-" + now.getMonth() + 1 + "-" + now.getDate();
  }

  getNextMorning() {
    const now = new Date();
    let modifier = 0;
    if (now.getHours() >= 8) {
      modifier = 1;
    }
    now.setDate(now.getDate() + modifier);
    now.setHours(8);
    now.setMinutes(0);
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
