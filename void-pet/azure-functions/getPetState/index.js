const {BlobServiceClient} = require('@azure/storage-blob');

module.exports = async function (context, req) {
    context.log('Get Pet State function processed a request.');

    // Get pet ID
    const petID = req.query.petID || (req.body && req.body.petID);

    if(!petID){
        context.res = {
            status: 400,
            body: "Please provide a petID"
        };
        return;
    }

    try{
        // connect to blob storage
        const BlobServiceClient = BlobServiceClient.fromConnectionString(
            process.env.BLOB_CONNECTION_STRING
        );

        const containerClient = blobServiceClient.getContainerClient(
            process.env.BLOB_CONTAINER_NAME
        );

        // crete container if it doesn't exist
        await containerClient.createIfNotExists();

        const blobClient = containerClient.getBlobClient(`${petID}.json`);

        // check if pet exists
        if(!(await blobClient.exists())){
            // return default state for new pets
            context.res = {
                status: 200,
                body: {
                    id: petID,
                    hunger: 100,
                    tiredness: 100,
                    entertainment: 100,
                    lastUpdated: new Date().toISOString()
                }
            };
            return;
        }

        // download and parse pet data
        const downloadResponse = await blobClient.download();
        const petData = await streamToString(downloadResponse.readableStreamBody);

        context.res = {
            status: 200,
            body: JSON.parse(petData)
        };
    } catch (error){
        context.log.error('Error retrieving pet state: ', error);
        context.res = {
            status: 500,
            body: "Error retrieving pet status: " + error.message
        };
    }
};

// convert stream to string
async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
            chunks.push(data.toString());
        });
        readableStream.on("end", () => {
            resolve(chunks.join(""));
        });
        readableStream.on("error", reject);
    });
}