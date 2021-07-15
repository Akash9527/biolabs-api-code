import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { RequestStatusEnum } from "../enum/request-status-enum";

export class AddSpaceChangeWaitlistDto {

    @ApiProperty({ description: 'Resident Company Id', required: true, nullable: false })
    @IsNotEmpty()
    residentCompanyId: number;

    @ApiProperty({ description: 'Desired start date of plan', required: false, nullable: true })
    desiredStartDate: number;

    @ApiProperty({ description: 'Plan change summary', required: false, nullable: true, default: 'See Notes' })
    @IsNotEmpty()
    planChangeSummary: string;

    @ApiProperty({ description: 'Request status', default: 0, required: true, nullable: false })
    @IsNotEmpty()
    requestStatus: RequestStatusEnum;

    @ApiProperty({ description: 'The date on which request is fullfilled', required: false, nullable: true })
    fulfilledOn: number;

    @ApiProperty({ description: 'Internal or external request', required: true, nullable: false })
    @IsNotEmpty()
    isRequestInternal: boolean;

    @ApiProperty({ description: 'Request notes', required: false, nullable: true })
    @IsNotEmpty()
    requestNotes: string;

    @ApiProperty({ description: 'Internal notes', required: false, nullable: true })
    @IsNotEmpty()
    internalNotes: string;
}