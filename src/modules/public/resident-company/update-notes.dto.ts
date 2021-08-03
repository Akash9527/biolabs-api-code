import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateNotesDto {
    @ApiProperty({ description: 'The note' })
    @IsNotEmpty()
    notes: string;
}