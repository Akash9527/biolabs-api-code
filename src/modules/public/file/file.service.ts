import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';


@Injectable()
export class FileService {
  azureConnection = "DefaultEndpointsProtocol=https;AccountName=biolabsblob;AccountKey=LTpDkmuPGUHnlD/qInEwxV80bWglNPcHHgaP7cvywEnibJLA9DLyeM/lP5iq8i+QZjiy0smerZBNW35UWnDbdg==;EndpointSuffix=core.windows.net";
  containerName = "pictures";
  

  getBlobClient(imageName:string):BlockBlobClient{
    const blobClientService = BlobServiceClient.fromConnectionString(this.azureConnection);
    const containerClient = blobClientService.getContainerClient(this.containerName);
    const blobClient = containerClient.getBlockBlobClient(imageName);
    return blobClient;
  }

  async upload(file:Express.Multer.File){
    const blobClient = this.getBlobClient(file.originalname);
    await blobClient.uploadData(file.buffer);
  }

  async getfileStream(fileName: string){
    const blobClient = this.getBlobClient(fileName);
    var blobDownloaded = await blobClient.download();
    return blobDownloaded.readableStreamBody;
  }

  async delete(filename: string){
    const blobClient = this.getBlobClient(filename);
    await blobClient.deleteIfExists();
  }
}
