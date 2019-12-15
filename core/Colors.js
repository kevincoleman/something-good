
export class Colors {

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

  getRandom = () => {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

}
