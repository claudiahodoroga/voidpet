module.exports = async function (context, req) {
    const state = req.body;

    // Save state to blob/Cosmos (not shown here)
    context.res = {
        body: { status: "ok", newState: state }
    };
}
