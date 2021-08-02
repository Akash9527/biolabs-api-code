import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateNotesDto {
    // @ApiProperty({ description: 'This is company ID' })
    // @IsNotEmpty()
    // @IsNumber()
    // companyId: number

    @ApiProperty({ description: 'The note' })
    @IsNotEmpty()
    notes: string;
}