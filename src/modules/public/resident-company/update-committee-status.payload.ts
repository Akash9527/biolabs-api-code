import { ApiProperty } from "@nestjs/swagger";

type committee_status = '0' | '1' | '2' | '3';

export class UpdateCommitteeStatusPayload{
    @ApiProperty({
        required: true,
    })
    companyId: number;

    @ApiProperty({
        required: false,
    })
    committeeStatus: committee_status;

    @ApiProperty({
        required: false,
    })
    selectionDate: Date;
}