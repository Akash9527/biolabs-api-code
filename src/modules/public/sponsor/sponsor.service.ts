import { Injectable } from '@nestjs/common';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { UpdateSponsorDto } from './dto/update-sponsor.dto';

@Injectable()
export class SponsorService {
  
  getDashboardDetail() {
    return `This action returns all sponsor`;
  }

  
}
