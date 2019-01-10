export default class Utility {
  getToday() {
    const today = new Date();
    // console.warn(today.toISOString());
    return (
      today.getFullYear() + "-" + today.getMonth() + 1 + "-" + today.getDate()
    );
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
