import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { createNewPet, Pet } from "../../shared/pet.model"; // Assuming Pet is the type, createNewPet is a helper
import { StorageService } from "../../shared/storage.service";

async function createPetHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`CreatePet HTTP trigger function processed request for url "${request.url}"`);

    let requestBody;
    try {
        requestBody = await request.json() as { name: string }; // Expecting a JSON body with a 'name' property
    } catch (e) {
        context.log("Invalid JSON body for CreatePet:", e);
        return {
            status: 400,
            jsonBody: { message: "Request body must be valid JSON." }
        };
    }

    const name = requestBody?.name;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        context.log("CreatePet: Pet name not provided or invalid.");
        return {
            status: 400,
            jsonBody: { message: "Please provide a valid pet name in the request body." }
        };
    }

    try {
        const newPet: Pet = createNewPet(name.trim()); // createNewPet should return a Pet object
        const storageService = new StorageService();
        await storageService.savePet(newPet); // savePet should handle creating a new entry

        context.log(`Successfully created pet with ID: ${newPet.id} and Name: ${newPet.name}`);
        return {
            status: 201, // 201 Created is appropriate for successful creation
            jsonBody: newPet
        };
    } catch (error) {
        context.log("Error creating pet:", error instanceof Error ? error.message : JSON.stringify(error));
        return {
            status: 500,
            jsonBody: { 
                message: `Error creating pet. Details: ${error instanceof Error ? error.message : 'Unknown error'}` 
            }
        };
    }
}

// Registering the function with a specific route and as a POST method
app.post('CreatePet', { // 'CreatePet' is the function name
    route: 'CreatePet',   // The endpoint will be /api/CreatePet
    authLevel: 'anonymous',
    handler: createPetHandler
});