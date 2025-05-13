import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { Pet } from "./pet.model";

export class StorageService {
  private containerClient: ContainerClient;

  constructor() {
    const connectionString = process.env.STORAGE_CONNECTION_STRING || "";
    const containerName = process.env.STORAGE_CONTAINER_NAME || "pets";
    
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient = blobServiceClient.getContainerClient(containerName);
  }

  async savePet(pet: Pet): Promise<void> {
    const blobName = `${pet.id}.json`;
    const blobClient = this.containerClient.getBlockBlobClient(blobName);
    
    await blobClient.upload(JSON.stringify(pet), JSON.stringify(pet).length);
  }

  async getPet(petId: string): Promise<Pet | null> {
    const blobName = `${petId}.json`;
    const blobClient = this.containerClient.getBlockBlobClient(blobName);
    
    try {
      const downloadResponse = await blobClient.download();
      const content = await this.streamToString(downloadResponse.readableStreamBody);
      return JSON.parse(content) as Pet;
    } catch (error) {
      return null;
    }
  }

  private async streamToString(readableStream: NodeJS.ReadableStream | undefined): Promise<string> {
    if (!readableStream) {
      return "";
    }
    
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      readableStream.on("data", (data) => {
        chunks.push(Buffer.from(data));
      });
      readableStream.on("end", () => {
        resolve(Buffer.concat(chunks).toString("utf-8"));
      });
      readableStream.on("error", reject);
    });
  }
}