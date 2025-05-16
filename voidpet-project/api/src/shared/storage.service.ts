import { BlobServiceClient, ContainerClient, BlockBlobClient, RestError } from "@azure/storage-blob";
import { Pet } from "./pet.model"; // Ensure this path is correct if Pet model is here

export class StorageService {
    private containerClient: ContainerClient;
    private readonly containerName: string;
    private isInitialized: boolean = false; // To ensure container check runs once

    constructor() {
        console.log("StorageService: Constructor called.");
        const connectionString = process.env.STORAGE_CONNECTION_STRING;
        const containerNameEnv = process.env.STORAGE_CONTAINER_NAME;

        if (!connectionString) {
            console.error("Azure Storage Connection String (STORAGE_CONNECTION_STRING) is not defined in environment variables.");
            throw new Error("Azure Storage Connection String is not configured.");
        }

        this.containerName = containerNameEnv || "pets";
        if (!this.containerName) {
            console.error("Azure Storage Container Name (STORAGE_CONTAINER_NAME) is not defined in environment variables.");
            throw new Error("Azure Storage Container Name is not configured.");
        }

        try {
            const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            this.containerClient = blobServiceClient.getContainerClient(this.containerName);
            console.log("StorageService: BlobServiceClient and ContainerClient initialized."); // New Log
        } catch (error) {
            console.error("StorageService ERROR: Failed to initialize BlobServiceClient or ContainerClient:", error);
            throw error; // Re-throw to prevent service from being used in a bad state
        }
    }

    // Helper to ensure container exists, call before blob operations
    private async ensureContainerExists(): Promise<void> {
        if (this.isInitialized) {
            return;
        }
        try {
            // Create the container if it does not exist
            await this.containerClient.createIfNotExists({ access: 'blob' }); // 'blob' allows anonymous read if desired, 'container' for more control
            console.log(`StorageService: Container "${this.containerName}" is ready.`);
            this.isInitialized = true;
        } catch (error) {
            console.error(`StorageService: Failed to create or connect to container "${this.containerName}":`, error);
            throw error; // Re-throw if container creation fails, as service can't operate
        }
    }

    private getBlockBlobClient(blobName: string): BlockBlobClient {
        return this.containerClient.getBlockBlobClient(blobName);
    }

    async savePet(pet: Pet): Promise<void> {
        await this.ensureContainerExists(); // Ensure container is ready

        if (!pet || !pet.id) {
            throw new Error("Pet data or Pet ID is undefined. Cannot save to blob storage.");
        }
        const blobName = `${pet.id}.json`; // Use pet ID for blob name
        const blockBlobClient = this.getBlockBlobClient(blobName);
        const data = JSON.stringify(pet, null, 2); // Pretty print JSON for readability in storage

        try {
            await blockBlobClient.upload(data, Buffer.byteLength(data), {
                blobHTTPHeaders: { blobContentType: "application/json" }
            });
            console.log(`StorageService: Pet ${pet.id} saved to blob ${blobName} in container ${this.containerName}.`);
        } catch (error) {
            console.error(`StorageService: Error uploading pet ${pet.id} to blob ${blobName}:`, error);
            throw error; // Re-throw to be caught by the Azure Function handler
        }
    }

    async getPet(petId: string): Promise<Pet | null> {
        await this.ensureContainerExists(); // Ensure container is ready

        if (!petId) {
            throw new Error("Pet ID is undefined. Cannot retrieve from blob storage.");
        }
        const blobName = `${petId}.json`;
        const blockBlobClient = this.getBlockBlobClient(blobName);

        try {
            const downloadResponse = await blockBlobClient.downloadToBuffer();
            const petDataString = downloadResponse.toString();
            console.log(`StorageService: Pet ${petId} retrieved from blob ${blobName}.`);
            return JSON.parse(petDataString) as Pet;
        } catch (error) {
            const restError = error as RestError;
            if (restError && restError.statusCode === 404) {
                console.log(`StorageService: Pet ${petId} (blob: ${blobName}) not found.`);
                return null; // Return null if blob (pet) is not found
            }
            console.error(`StorageService: Error retrieving pet ${petId} (blob: ${blobName}):`, error);
            throw error; // Re-throw other errors
        }
    }

    // Optional: Implement deletePet if needed
    // async deletePet(petId: string): Promise<void> {
    //     await this.ensureContainerExists();
    //     if (!petId) {
    //         throw new Error("Pet ID is undefined. Cannot delete from blob storage.");
    //     }
    //     const blobName = `${petId}.json`;
    //     const blockBlobClient = this.getBlockBlobClient(blobName);
    //     try {
    //         await blockBlobClient.delete();
    //         console.log(`StorageService: Pet ${petId} (blob: ${blobName}) deleted.`);
    //     } catch (error) {
    //         const restError = error as RestError;
    //         if (restError && restError.statusCode === 404) {
    //             console.log(`StorageService: Pet ${petId} (blob: ${blobName}) not found for deletion.`);
    //             return; // Or throw, depending on desired behavior
    //         }
    //         console.error(`StorageService: Error deleting pet ${petId} (blob: ${blobName}):`, error);
    //         throw error;
    //     }
    // }
}