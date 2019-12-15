
export class Encouragements {

  encouragements = [
    "Great job! The world is a better place because of you.",
    "Solid work. Sometimes it’s the little things that save lives.",
    "Well done. You did a good thing!",
    "The hardest step is often the first one.",
    "Way to make a difference!",
    "Doing something good makes you feel good, too.",
    "One more good deed done!",
    "Lots of small things make one big thing."
  ];

  getRandom = () => {
    return this.encouragements[Math.floor(Math.random() * this.encouragements.length)];
  }

}
