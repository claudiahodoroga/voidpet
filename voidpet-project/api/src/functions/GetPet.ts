import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { StorageService } from "../shared/storage.service";

async function getPetHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`GetPet function processed request for url "${request.url}"`);

  const petId = request.query.get("id"); // Para el parámetro ?id=value

  if (!petId) {
    return {
      status: 400,
      jsonBody: {
        message: "Please provide a pet ID.",
      },
    };
  }

  try {
    const storageService = new StorageService();
    const pet = await storageService.getPet(petId as string);

    if (!pet) {
      return {
        status: 404,
        jsonBody: {
          message: "Pet not found.",
        },
      };
    }

    return {
      status: 200,
      jsonBody: pet,
    };
  } catch (error) {
    context.log(
      "Error retrieving pet: ",
      error instanceof Error ? error.message : JSON.stringify(error)
    );
    return {
      status: 500,
      jsonBody: {
        message: `Error retrieving pet. Details: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
    };
  }
}

// Registrar función
app.http("GetPet", {
  methods: ["GET", "POST"], 
  authLevel: "anonymous",
  route: "GetPet", // endpoint es /api/GetPet
  handler: getPetHandler, 
});

