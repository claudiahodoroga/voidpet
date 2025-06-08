import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Pet } from "../shared/pet.model"; // Ensure Pet model is correctly imported
import { StorageService } from "../shared/storage.service";

// Función utilitaria para comprobar si un string es una fecha formato ISO 8601 válida
function isValidISODateString(dateString: string): boolean {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(dateString)) {
        return false;
    }
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date.toISOString() === dateString;
}


async function savePetHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`SavePet HTTP trigger function processed request for url "${request.url}"`);

    let requestBody: Partial<Pet>; 

    try {
        requestBody = await request.json() as Partial<Pet>;
    } catch (e) {
        context.log("WARN: Invalid JSON body for SavePet:", e);
        return {
            status: 400,
            jsonBody: { message: "Request body must be valid JSON." }
        };
    }

    if (!requestBody) { 
        context.log("WARN: SavePet: Request body is missing or could not be parsed.");
        return { status: 400, jsonBody: { message: "Request body is missing." } };
    }

    // 1. Validate 'id'
    if (typeof requestBody.id !== 'string' || requestBody.id.trim() === '') {
        context.log("WARN: SavePet: Pet 'id' missing, not a string, or empty.");
        return { status: 400, jsonBody: { message: "Request body must contain a valid 'id' (string)." } };
    }

    // 2. Validate 'name'
    if (typeof requestBody.name !== 'string' || requestBody.name.trim() === '') {
        context.log("WARN: SavePet: Pet 'name' missing, not a string, or empty.");
        return { status: 400, jsonBody: { message: "Request body must contain a valid 'name' (string)." } };
    }

    // 3. Validate 'dateCreated' - Stricter Validation
    if (typeof requestBody.dateCreated !== 'string' || !isValidISODateString(requestBody.dateCreated)) {
        context.log("WARN: SavePet: Pet 'dateCreated' missing, not a string, or not a valid ISO 8601 date string.");
        return { status: 400, jsonBody: { message: "Request body must contain a valid 'dateCreated' (ISO 8601 string, e.g., YYYY-MM-DDTHH:mm:ss.sssZ)." } };
    }
    
    // 4. Validate 'stats' object and its properties
    if (typeof requestBody.stats !== 'object' || requestBody.stats === null) {
        context.log("WARN: SavePet: Pet 'stats' object missing or not an object.");
        return { status: 400, jsonBody: { message: "Request body must contain a 'stats' object." } };
    }
    if (typeof requestBody.stats.entertainment !== 'number') {
        context.log("WARN: SavePet: Pet 'stats.entertainment' missing or not a number.");
        return { status: 400, jsonBody: { message: "Request body must contain 'stats.entertainment' (number)." } };
    }
    if (typeof requestBody.stats.hunger !== 'number') {
        context.log("WARN: SavePet: Pet 'stats.hunger' missing or not a number.");
        return { status: 400, jsonBody: { message: "Request body must contain 'stats.hunger' (number)." } };
    }
    if (typeof requestBody.stats.tiredness !== 'number') {
        context.log("WARN: SavePet: Pet 'stats.tiredness' missing or not a number.");
        return { status: 400, jsonBody: { message: "Request body must contain 'stats.tiredness' (number)." } };
    }

    const validatedInput = requestBody as {
        id: string;
        name: string;
        dateCreated: string;
        stats: {
            entertainment: number;
            hunger: number;
            tiredness: number;
        };
    } & Partial<Pet>;


    try {
        const storageService = new StorageService();
        
        const petToSave: Pet = {
            id: validatedInput.id,
            name: validatedInput.name,
            dateCreated: validatedInput.dateCreated, 
            stats: {
                entertainment: validatedInput.stats.entertainment,
                hunger: validatedInput.stats.hunger,
                tiredness: validatedInput.stats.tiredness,
            },
            lastInteraction: new Date().toISOString(),
        };

        await storageService.savePet(petToSave);

        context.log(`Successfully saved pet with ID: ${petToSave.id}`);
        return {
            status: 200,
            jsonBody: petToSave
        };
    } catch (error) {
        context.log("ERROR: Error saving pet:", error instanceof Error ? error.message : JSON.stringify(error));
        return {
            status: 500,
            jsonBody: { 
                message: `Error saving pet. Details: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
        };
    }
}

app.put('SavePet', { 
    route: 'SavePet', 
    authLevel: 'anonymous',
    handler: savePetHandler
});
