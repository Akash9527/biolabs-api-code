import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { ResidentCompanyService } from '../resident-company';
import { UsersService } from '../user/user.service';

@Injectable()
export class FileService {

  constructor(
    private readonly userService: UsersService,
    private readonly residentCompanyService: ResidentCompanyService
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
    const companyId = payload.companyId;

    if (file) {
      const fileName = ((userId) ? userId : companyId) + "-" + new Date().getTime() + "-" + file.originalname;
      const blobClient = this.getBlobClient(fileName, payload.fileType);
      try {
        const uploaded = await blobClient.uploadData(file.buffer);
        if (payload.fileType == 'user')
          await this.userService.updateUserProfilePic({ id: userId, imageUrl: fileName });

        if (payload.fileType == 'pitchdeck' || payload.fileType == 'logo')
          await this.residentCompanyService.updateResidentCompanyImg({ id: companyId, imageUrl: fileName, fileType : payload.fileType });

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

  async getfileStream(fileName: string, fileType: string) {
    try {
      const blobClient = this.getBlobClient(fileName, fileType);
      const blobDownloaded = await blobClient.download();
      return blobDownloaded.readableStreamBody;
    } catch (error) {
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