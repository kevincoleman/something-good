export class ThingGateway {
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
      .catch(err => {
        // handle offline
        console.warn("Need to handle offline case");
        throw err;
      });
    return things;
  }

  // one(id) { }
}
