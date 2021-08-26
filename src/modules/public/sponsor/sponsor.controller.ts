import { Controller, Get, HttpException, UseGuards } from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { ResidentCompanyService } from '../resident-company';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
let KeyVault = require('azure-keyvault');
let AuthenticationContext = require('adal-node').AuthenticationContext;

@Controller('api/sponsor')
@ApiTags('sponsor')
export class SponsorController {
  constructor(private readonly sponsorService: SponsorService,
    private readonly residentCompanyService: ResidentCompanyService) { }

  /**
   * Description: This method is used to show Dashboard data of sponsor.
   * @description This method is used to show Dashboard data of sponsor.
   * @param payload it is a request query expects the payload of type ?any.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('global-data')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  dashboard() {
    return this.residentCompanyService.getResidentCompanyForSponsor();
  }

  /**
    * Description: This method is used to show Dashboard data of sponsor with site.
    * @description This method is used to show Dashboard data of sponsor with site.
    * @param payload it is a request query expects the payload of type ?any.
    */
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('site-data')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  dashboardBySite() {
    return this.residentCompanyService.getResidentCompanyForSponsorBySite();
  }

  /**
    * Description: This method is used to get the values from azure key vault service.
    * @description This method is used to get the values from azure key vault service.
    */
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard())
  @Get('getKeyVault')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getKeyVault() {
    let clientId = "977fb5e9-1d3d-431c-8687-2de397963e67";
    let clientSecret = "jVeF6Z.4T-_0prNc5Q624d75fG89~V1CK_";
    let vaultUri = "https://biolabs-prod.vault.azure.net/";

    let authenticator = function (challenge, callback) {
      let context = new AuthenticationContext(challenge.authorization);
      return context.acquireTokenWithClientCredentials(challenge.resource, clientId, clientSecret, function (err, tokenResponse) {
        if (err) throw err;
        let authorizationValue = tokenResponse.tokenType + ' ' + tokenResponse.accessToken;
        return callback(null, authorizationValue);
      });
    };

    // code for new client
    let credentials = new KeyVault.KeyVaultCredentials(authenticator);
    let client = new KeyVault.KeyVaultClient(credentials);

    //code for fetching secret
    let secretName = 'user'
    let secretVersion = ''
    client.getSecret(vaultUri, secretName, secretVersion).then((result) => {
      return result
    }).catch(err => {
      throw new HttpException({
        status: "Error",
        message: err.message,
        body: err
      }, 406);
    });
  }
}