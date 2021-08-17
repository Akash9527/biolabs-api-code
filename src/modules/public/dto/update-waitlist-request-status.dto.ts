import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { RequestStatusEnum } from "../enum/request-status-enum";

/**
 * @description A DTO to accept id and status of Space Change Waitlist to update the status of a record.
 */
export class UpdateWaitlistRequestStatusDto {

  @ApiProperty({ description: 'Space Change Waitlist Id', required: true, nullable: false })
  @IsNotEmpty()
  @IsNumber()
  id: number

  @ApiProperty({ description: 'Status of Space Change Waitlist', required: true, nullable: false })
  @IsEnum(RequestStatusEnum)
  status: RequestStatusEnum;
}
