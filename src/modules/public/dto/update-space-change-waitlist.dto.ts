import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, Min } from "class-validator";
import { MembershipChangeEnum } from "../enum/membership-change-enum";
import { RequestStatusEnum } from "../enum/request-status-enum";
import { ItemDto } from "./item.dto";

export class UpdateSpaceChangeWaitlistDto {

    @ApiProperty({ description: 'Space Change Waitlist Id', required: true, nullable: false })
    @IsNotEmpty()
    spaceChangeWaitlistId: number;

    @ApiProperty({ description: 'Items', required: false, nullable: true })
    items: ItemDto[];

    @ApiProperty({ description: 'Desired start date of plan', required: false, nullable: true })
    desiredStartDate: number;

    @ApiProperty({ description: 'Plan change summary', required: false, nullable: true, default: 'See Notes' })
    planChangeSummary: string;

    @ApiProperty({ description: 'Request status', default: 0, required: true, nullable: false })
    @IsNotEmpty()
    @IsEnum(RequestStatusEnum)
    requestStatus: RequestStatusEnum;

    @ApiProperty({ description: 'The date on which request is fullfilled', required: false, nullable: true })
    fulfilledOn: number;

    @ApiProperty({ description: 'Internal or external request', required: true, nullable: false })
    @IsNotEmpty()
    isRequestInternal: boolean;

    @ApiProperty({ description: 'Request notes', required: false, nullable: true })
    requestNotes: string;

    @ApiProperty({ description: 'Internal notes', required: false, nullable: true })
    internalNotes: string;

    @ApiProperty({ description: 'Site notes', required: false, nullable: true })
    siteNotes: string;

    @ApiProperty({ description: 'Membership change', required: true, nullable: false })
    @IsNotEmpty()
    @IsEnum(MembershipChangeEnum)
    membershipChange: MembershipChangeEnum;

    @ApiProperty({ description: 'Request Graduate Date', required: false, nullable: true })
    requestGraduateDate: number;

    @ApiProperty({ description: 'Market place', required: false, nullable: true })
    marketPlace: boolean;

    @ApiProperty({ description: 'Company Stage of Development', required: false, nullable: true })
    @Min(1)
    companyStage: number;

    @ApiProperty({ description: 'Funding to date', required: false, nullable: true })
    @IsNotEmpty()
    @Min(0)
    funding: string;

    @ApiProperty({ description: 'Funding Source', required: false, nullable: true })
    @IsNotEmpty()
    @Min(1, { each: true })
    fundingSource: number[];

    @ApiProperty({ description: 'Total Company Size', required: false, nullable: true })
    companySize: number;

    @ApiProperty({ description: 'Confirmation to share company profile', required: true, nullable: false })
    shareYourProfile: boolean;
}