module.exports = async function (context, req) {
    const petId = req.query.petId || (req.body && req.body.petId);

    // fake data — eventually pull from Blob or Cosmos
    const fakeState = {
        id: petId,
        hunger: 40,
        energy: 80,
        mood: "happy"
    };

    context.res = {
        body: fakeState
    };
}
