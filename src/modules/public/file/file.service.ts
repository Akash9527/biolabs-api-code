import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { UsersService } from '../user/user.service';

@Injectable()
export class FileService {

  constructor(
    private readonly userService: UsersService
  ) { }

  azureConnection = process.env.APPSETTING_AZURE_STORAGE_CONNECTION;

  getBlobClient(imageName: string, containerName: string): BlockBlobClient {
    const blobClientService = BlobServiceClient.fromConnectionString(this.azureConnection);
    const containerClient = blobClientService.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(imageName);
    return blobClient;
  }

  async upload(file: Express.Multer.File, payload: any) {
    const userId = payload.userId;
    if (file) {
      const fileName = userId + "-" + new Date().getTime() + "-" + file.originalname;
      const blobClient = this.getBlobClient(fileName, payload.userType);
      try {
        const uploaded = await blobClient.uploadData(file.buffer);
        console.log("uploaded", uploaded);
        await this.userService.updateUserProfilePic({ id: userId, imageUrl: fileName });
        return { upload: uploaded, fileName: fileName };
      } catch (error) {
        throw new BadRequestException(
          error.message
        );
      }
    } else {
      throw new NotAcceptableException(
        'File is invalid.',
      );
    }
  }

  async getfileStream(fileName: string, userType: string) {
    try {
      const blobClient = this.getBlobClient(fileName, userType);
      const blobDownloaded = await blobClient.download();
      return blobDownloaded.readableStreamBody;
    } catch (error) {
      console.log("error: " + error.message);
      throw new BadRequestException(
        error.message
      );
    }
  }

  async delete(filename: string, containerName: string) {
    const blobClient = this.getBlobClient(filename, containerName);
    await blobClient.deleteIfExists();
  }
}