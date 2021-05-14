import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { UsersService } from '../user/user.service';


@Injectable()
export class FileService {

  constructor(
    private readonly userService: UsersService,
  ) { }

  azureConnection = "DefaultEndpointsProtocol=https;AccountName=biolabsblob;AccountKey=LTpDkmuPGUHnlD/qInEwxV80bWglNPcHHgaP7cvywEnibJLA9DLyeM/lP5iq8i+QZjiy0smerZBNW35UWnDbdg==;EndpointSuffix=core.windows.net";
  containerName = "user";

  getBlobClient(imageName:string):BlockBlobClient{
    const blobClientService = BlobServiceClient.fromConnectionString(this.azureConnection);
    const containerClient = blobClientService.getContainerClient(this.containerName);
    const blobClient = containerClient.getBlockBlobClient(imageName);
    return blobClient;
  }

  async upload(file:Express.Multer.File, payload:any){
    const userId = payload.userId;
    this.containerName = payload.userType;
    if(file){
      const fileName = userId +"-"+ new Date().getTime() +"-"+ file.originalname;
      const blobClient = this.getBlobClient(fileName);
      try{
        const uploaded = await blobClient.uploadData(file.buffer);
        console.log("uploaded", uploaded);
        const userResp = await this.userService.updateUserProfilePic({id: userId, imageUrl: fileName});
        return uploaded;  
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
