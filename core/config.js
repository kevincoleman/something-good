export function getRandomColor() {
  const colors = [
    "442B48",
    "6320EE",
    "D81E5B",
    "F15152",
    "66635B",
    "A4036F",
    "16DB93",
    "F29E4C"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function getRandomEncouragement() {
  const encouragements = [
    "Great job! The world is a better place because of you.",
    "Solid work. Sometimes it’s the little things that save lives.",
    "Well done. You did a good thing!",
    "The hardest step is often the first one.",
    "Way to make a difference!",
    "Doing something good makes you feel good, too.",
    "One more good deed done!",
    "Lots of small things make one big thing."
  ];
  return encouragements[Math.floor(Math.random() * encouragements.length)];
}
