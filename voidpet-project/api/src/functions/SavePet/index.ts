import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Pet } from "../../shared/pet.model";
import { StorageService } from "../../shared/storage.service";

async function savePetHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`SavePet HTTP trigger function processed request for url "${request.url}"`);

    // Example: Assuming pet ID comes from the route, e.g., /api/SavePet/{id}
    // const petIdFromRoute = request.params.id; // 'id' must match the name in the route parameter definition

    let petDataToSave: Partial<Pet>; // Use Partial<Pet> if allowing partial updates
    let petId: string | undefined;

    try {
        // For SavePet, the request body should contain the pet data, including its ID.
        const requestBody = await request.json() as Pet;
        petDataToSave = requestBody;
        petId = requestBody?.id;

    } catch (e) {
        context.log("Invalid JSON body for SavePet:", e);
        return {
            status: 400,
            jsonBody: { message: "Request body must be valid JSON and represent a Pet object." }
        };
    }
    
    // if (petIdFromRoute && petIdFromBody && petIdFromRoute !== petIdFromBody) {
    //     context.log.warn("SavePet: Mismatch between route ID and body ID.");
    //     return {
    //         status: 400,
    //         jsonBody: { message: "Pet ID in route and body must match, or ID only in body." }
    //     };
    // }

    // const finalPetId = petIdFromRoute || petIdFromBody;

    if (!petId || typeof petId !== 'string') {
        context.log("SavePet: Pet ID not provided in the request body.");
        return {
            status: 400,
            jsonBody: { message: "Please provide a valid pet object with an ID in the request body." }
        };
    }

    if (!petDataToSave) { // Should have been caught by the JSON parse, but as a safeguard
        return { status: 400, jsonBody: { message: "Pet data is missing in the request body." }};
    }


    try {
        const storageService = new StorageService();
        
        // Optional: Fetch existing pet to ensure it exists before saving, or if only partial updates are allowed.
        // const existingPet = await storageService.getPet(finalPetId);
        // if (!existingPet) {
        //     return {
        //         status: 404,
        //         jsonBody: { message: `Pet with ID ${finalPetId} not found. Cannot update.` }
        //     };
        // }

        // Create a Pet object for saving. Ensure all required fields for 'Pet' are present if not a partial update.
        const petToSave: Pet = {
            ...petDataToSave, // Spread the incoming data
            id: petId,      // Ensure ID is set
            lastInteraction: new Date().toISOString() // Update last interaction time
        };


        await storageService.savePet(petToSave); // savePet should handle updating an existing entry based on ID

        context.log(`Successfully saved pet with ID: ${petToSave.id}`);
        return {
            status: 200, // 200 OK for successful update
            jsonBody: petToSave
        };
    } catch (error) {
        context.log("Error saving pet:", error instanceof Error ? error.message : JSON.stringify(error));
        return {
            status: 500,
            jsonBody: { 
                message: `Error saving pet. Details: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
        };
    }
}

// Registering the function.
// If pet ID is in the route, it would be e.g. route: 'SavePet/{id}'
// Assuming for now the full pet object (ID included) is in the body, and it's a PUT or POST
app.put('SavePet', {  // Using PUT for update is common
    route: 'SavePet', // The endpoint will be /api/SavePet. 
                      // If ID in route: 'SavePet/{petIdInRouteParam}' then access with request.params.petIdInRouteParam
    authLevel: 'anonymous',
    handler: savePetHandler
});

// Alternatively, if you prefer POST for save:
// app.post('SavePet', {
//     route: 'SavePet',
//     authLevel: 'anonymous',
//     handler: savePetHandler
// });