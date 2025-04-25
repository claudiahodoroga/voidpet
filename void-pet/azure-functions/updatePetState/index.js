const { BlobServiceClient } = require('@azure/storage-blob');

module.exports = async function (context, req) {
    context.log('Update Pet State function processed a request.');

    // check if we have the required data
    if(!req.body || !req.body.petID){
        context.res = {
            status: 400,
            body: "Please provide petID and update data in the request body"
        };
        return;
    }

    const petID = req.body.petID;
    
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
        
        let petData;

        // check if pet exists
        if(await blobClient.exists()){
            const downloadResponse = await blobClient.download();
            const petDataStr = await streamToString(downloadResponse.readableStreamBody);
            petData = JSON.parse(petDataStr);
        }
        else{
            // create new pet with default values
            petData = {
                id: petID,
                hunger: 100,
                tiredness: 100,
                entertainment: 100,
                createdAt: new Date().toISOString()
            };
        }

        // update pet data with values from request
        const updates = req.body;
        delete updates.petID; // remove petID frfom the updates

        // merge updates with existing data
        const updatedPetData = {
            ...petData,
            ...updates,
            lastUpdated: new Date().toISOString()
        };

        // upload updated data
        const blockBlobClient = containerClient.getBlockBlobClient(`${petID}.json`);
        await blockBlobClient.upload(
            JSON.stringify(updatedPetData),
            JSON.stringify(updatedPetData).length
        );

        context.res = {
            status: 200,
            body: updatedPetData
        };
    } catch (error){
        context.log.error('Error updating pet state: ', error);
        context.res = {
            status: 500,
            body: "Error updating pet state: " + error.message
        };
    }
};

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