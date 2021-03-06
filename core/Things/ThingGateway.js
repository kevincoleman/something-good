export class ThingGateway {

  // Hierarchy:
    // Get online things (all)
    // Get locally stored things (local)
    // Get hard-coded defaults (offline)

  constructor(storage, tracker) {
    this.storage = storage;
    this.tracker = tracker;
  }

  async all() {
    let things = await fetch(
      "https://things.somethinggood.app/goodThings.json",
      {
        Accept: "application/json"
      }
    )
      .then(res => {
        return res.json();
      })
      .catch(error => {
        this.tracker.trackEvent(
          "error",
          { source: "ThingGateway.js:all()", description: "Failed to get list of things from API." }
        );
        return this.local();
      });

    return things;
  }

  async local() {
    let localThings = JSON.parse(await this.storage.retrieve("allThings"));
    if (localThings) {
      return localThings
    } else {
      return this.offline();
    }
  }

  async offline() {
    return [
      { "title": "Smile at someone.", "id": 0 },
      { "title": "Say something nice.", "id": 1 },
      { "title": "Listen to someone intently.", "id": 2 },
      { "title": "Write someone an enouraging note or text.", "id": 3 },
      { "title": "Give a gift.", "id": 4 },
      { "title": "Check in on someone who looks up to you.", "id": 5 },
      { "title": "Donate to a good cause.", "id": 6 },
      { "title": "Bring someone a glass of water.", "id": 7 },
      { "title": "Throw away some trash you find.", "id": 8 },
      { "title": "Forgive someone.", "id": 9 },
      { "title": "Thank someone.", "id": 10 },
      { "title": "Spend time with someone who will enjoy it.", "id": 11 },
      { "title": "Exercise.", "id": 12 },
      { "title": "Clean up a mess.", "id": 13 },
      { "title": "Travel using green transportation.", "id": 14 },
      { "title": "Treat yourself to something small.", "id": 15 },
      { "title": "Ask someone for forgiveness.", "id": 16 },
      { "title": "Help take care of a friend.", "id": 17 },
      { "title": "Share your favorite song with someone.", "id": 18 },
      { "title": "Spend some time contemplating and writing.", "id": 19 },
      { "title": "Video call someone you haven’t seen in a while.", "id": 20 },
      { "title": "Drink a glass of water.", "id": 21 },
      { "title": "Get some fresh air.", "id": 22 },
      { "title": "Try again at something you didn’t complete.", "id": 23 },
      { "title": "Give someone a hug.", "id": 24 },
      { "title": "Go for a walk.", "id": 25 },
      { "title": "Read for fun.", "id": 26 },
      { "title": "Do more than is asked of you.", "id": 27 },
      { "title": "Share something you’ve been saving.", "id": 28 },
      { "title": "Start a new tradition.", "id": 29 },
      { "title": "Affirm yourself by writing down a win you had.", "id": 30 },
      {
        "title": "Help a friend see the silver lining in their situation.",
        "id": 31
      },
      { "title": "Ask someone to share a win.", "id": 32 },
      { "title": "Make some plans you’ll look forward to.", "id": 33 },
      {
        "title": "Give away something you don’t need to someone who might.",
        "id": 34
      },
      { "title": "Write a list of things you’re thankful for.", "id": 35 },
      { "title": "Throw an impromptu party.", "id": 36 },
      { "title": "Work on learning a new skill.", "id": 37 },
      { "title": "Take care of a plant.", "id": 38 },
      { "title": "Enjoy a short nap.", "id": 39 },
      { "title": "Take a break from social media.", "id": 40 },
      { "title": "Share this app with someone who might enjoy it.", "id": 41 },
      { "title": "Mentor someone who looks up to you.", "id": 42 },
      { "title": "Treat yourself to a tasty food.", "id": 43 },
      { "title": "Recall a time when you experienced joy.", "id": 44 },
      { "title": "Share some good advice you’ve received.", "id": 45 },
      { "title": "Deliver a hand-written note.", "id": 46 },
      { "title": "Donate your time or talents to someone else.", "id": 47 },
      { "title": "Tell someone why you appreciate them.", "id": 48 },
      { "title": "Get someone flowers.", "id": 49 },
      { "title": "Volunteer in your community.", "id": 50 },
      { "title": "Share a meal with someone you enjoy.", "id": 51 },
      { "title": "Play a game with someone.", "id": 52 },
      { "title": "Make food for someone.", "id": 53 },
      { "title": "Make a list of things you like about yourself.", "id": 54 },
      { "title": "Spend some time thinking about causes you support.", "id": 55 },
      { "title": "Do a random act of kindness.", "id": 56 },
      { "title": "Let someone else go first.", "id": 57 },
      { "title": "Whistle a fun tune.", "id": 58 },
      {
        "title": "Ask someone older than you about their search for happiness.",
        "id": 59
      },
      { "title": "Spend time around an animal.", "id": 60 },
      { "title": "Get outside your comfort zone.", "id": 61 },
      { "title": "Arrive early.", "id": 62 },
      { "title": "Pause to appreciate beauty.", "id": 63 },
      { "title": "Get rid of something you don’t need.", "id": 64 },
      { "title": "Spend some time in the sun.", "id": 65 },
      { "title": "Learn about a different culture.", "id": 66 },
      { "title": "Wash your hands.", "id": 67 },
      { "title": "Dress up.", "id": 68 },
      { "title": "Shop local.", "id": 69 },
      { "title": "Eat something healthy.", "id": 70 },
      { "title": "Say “no” to something bad.", "id": 71 },
      { "title": "Relax for at least 10 minutes.", "id": 72 },
      { "title": "Share something good you’ve done.", "id": 73 },
      { "title": "Experience 5 minutes of silence.", "id": 74 },
      { "title": "Try a new food.", "id": 75 },
      { "title": "Settle a dispute peacefully.", "id": 76 },
      { "title": "Slow down and breathe deep.", "id": 77 },
      { "title": "Make the healthy choice.", "id": 78 },
      { "title": "Make a new friend.", "id": 79 },
      { "title": "Laugh with someone.", "id": 80 },
      { "title": "Tell someone who made a difference in your life.", "id": 81 },
      { "title": "Tell someone why you’re grateful for them.", "id": 82 },
      { "title": "Bake cookies to give away.", "id": 83 },
      { "title": "Hold the door for someone.", "id": 84 },
      { "title": "Send someone a post card.", "id": 85 },
      { "title": "Pay for someone’s meal or treat.", "id": 86 },
      { "title": "Give a positive review of a product or service.", "id": 87 },
      { "title": "Leave a surprise note for a loved one.", "id": 88 },
      { "title": "Share.", "id": 89 },
      { "title": "Leave a good tip.", "id": 90 },
      { "title": "Help someone carry a load.", "id": 91 },
      { "title": "Send someone a hand-written letter.", "id": 92 },
      { "title": "Give your change away.", "id": 93 },
      { "title": "Tell someone why you admire them.", "id": 94 },
      { "title": "Donate to a local food bank.", "id": 95 },
      { "title": "Watch a sunrise.", "id": 96 },
      { "title": "Watch a sunset.", "id": 97 },
      { "title": "Write your future self a nice note.", "id": 98 },
      { "title": "Play a musical instrument.", "id": 99 },
      { "title": "Do a few minutes of stretches.", "id": 100 },
      { "title": "Give someone a ride.", "id": 101 },
      { "title": "Experience nature.", "id": 102 },
      { "title": "Take a trip down memory lane", "id": 103 },
      { "title": "Thank your parents.", "id": 104 },
      { "title": "Remind someone that they’re loved.", "id": 105 },
      { "title": "Include someone.", "id": 106 },
      { "title": "Wash something that needs it.", "id": 107 },
      { "title": "Spend time with the elderly.", "id": 108 },
      { "title": "Take a photo with someone dear to you.", "id": 109 },
      { "title": "Ask someone to share their story.", "id": 110 },
      { "title": "Recycle.", "id": 111 },
      { "title": "Reuse something.", "id": 112 },
      { "title": "Sing a song.", "id": 113 },
      { "title": "Eat a vegetable.", "id": 114 },
      { "title": "Help someone else win.", "id": 115 },
      { "title": "Hold your tongue when it counts.", "id": 116 },
      { "title": "Draw a picture for someone.", "id": 117 },
      { "title": "Ask for someone else’s opinion.", "id": 118 },
      { "title": "Imagine yourself in someone else’s situation.", "id": 119 },
      { "title": "Write about a time you learned something.", "id": 120 },
      { "title": "Give someone a compliment.", "id": 121 },
      { "title": "Tell someone why they’re important to you.", "id": 122 },
      { "title": "Do some pushups.", "id": 123 },
      { "title": "Serve someone.", "id": 124 }
    ]
  }

  // one(id) { }
}
