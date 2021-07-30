import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateWaitlistPriorityOrderDto {

    @ApiProperty({ description: 'Space Change Waitlist id', required: true, nullable: false })
    @IsNotEmpty()
    spaceChangeWaitlistIds: number[];
}