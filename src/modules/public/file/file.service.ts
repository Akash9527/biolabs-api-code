import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { ResidentCompanyService } from '../resident-company';
import { UsersService } from '../user/user.service';
const {info,error,debug} = require('../../../utils/logger');

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
      debug("Uploading file "+fileName,__filename,"upload()");
      try {
        const uploaded = await blobClient.uploadData(file.buffer);
        if (payload.fileType == 'user')
          await this.userService.updateUserProfilePic({ id: userId, imageUrl: fileName });

        if (payload.fileType == 'pitchdeck' || payload.fileType == 'logo')
          await this.residentCompanyService.updateResidentCompanyImg({ id: companyId, imageUrl: fileName, fileType : payload.fileType });

        return { upload: uploaded, fileName: fileName };
      } catch (err) {
        error("Error in uploading file "+err.error,__filename,"upload()");
        throw new BadRequestException(
          err.message
        );
      }
    } else {
      error("File is invalid ",__filename,"upload()");
      throw new NotAcceptableException(
        'File is invalid.',
      );
    }
  }

  async getfileStream(fileName: string, fileType: string) {
    try {
      debug("Getting file stream file name is "+fileName,__filename,"getfileStream()");
      const blobClient = this.getBlobClient(fileName, fileType);
      const blobDownloaded = await blobClient.download();
      return blobDownloaded.readableStreamBody;
    } catch (err) {
      error("File is invalid "+err.message,__filename,"getfileStream()");
      throw new BadRequestException(
        err.message
      );
    }
  }

  async delete(filename: string, containerName: string) {
    debug("deleting file file name is "+filename,__filename,"delete()");
    try {
    const blobClient = this.getBlobClient(filename, containerName);
    await blobClient.deleteIfExists();
  } catch (err) {
    error("Error in deleting file "+err.message,__filename,"delete()");
    throw new BadRequestException(
      err.message
    );
  }
  }
}