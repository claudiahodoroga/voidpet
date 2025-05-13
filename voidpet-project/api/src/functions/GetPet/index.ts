import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { StorageService } from "../../shared/storage.service";

// The function can be named anything, e.g., 'getPetHandler'
// The signature changes: request first, then context. Context is InvocationContext.
// Return type is HttpResponseInit or Promise<HttpResponseInit>
async function getPetHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`GetPet function processed request for url "${request.url}"`);

    // Accessing query parameters: request.query.get('id')
    // Accessing route parameters (if any): request.params.id
    // Accessing request body (for POST/PUT): await request.json() or request.body
    const petId = request.query.get("id"); // For query parameter ?id=value
    // If you expect it in the body (e.g. for a POST, though less common for GET):
    // let petIdFromBody;
    // if (request.body) {
    //   try {
    //     const body = await request.json(); // if body is JSON
    //     petIdFromBody = body.id;
    //   } catch (e) {
    //     context.log.warn("Could not parse request body as JSON for petId");
    //   }
    // }
    // const finalPetId = petId || petIdFromBody;


    if (!petId) {
        return {
            status: 400,
            jsonBody: { // Use jsonBody for JSON responses, or body for plain text/other
                message: "Please provide a pet ID."
            }
        };
    }

    try {
        const storageService = new StorageService();
        const pet = await storageService.getPet(petId as string);

        if (!pet) {
            return {
                status: 404,
                jsonBody: {
                    message: "Pet not found."
                }
            };
        }

        return {
            status: 200,
            jsonBody: pet
        };
    } catch (error) {
        context.log("Error retrieving pet: ", error instanceof Error ? error.message : JSON.stringify(error));
        return {
            status: 500,
            jsonBody: {
                message: `Error retrieving pet. Details: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
        };
    }
}

// Programmatic registration of the function
// 'GetPet' here is the function name as Azure will know it.
app.http('GetPet', { // This name should match what's in your function.json if it's still used, or just be unique
    methods: ['GET', 'POST'], // Specify methods
    authLevel: 'anonymous',
    route: 'GetPet', // Optional: define a specific route, e.g., 'pets/{id}'
                     // If not set, it defaults to the function name 'GetPet'
    handler: getPetHandler // Point to your function code
});

// Note: With this v4 model, you typically don't do 'export default ...' for the handler.
// The 'app.http' call registers it.
// You might need to adjust your 'api/package.json' 'main' field if you consolidate registrations,
// or ensure each function file is discovered. For now, 'func host start' should pick these up.