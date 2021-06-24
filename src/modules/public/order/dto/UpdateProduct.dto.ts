import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateProductDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        required: false,
    })
    description: string;

    @ApiProperty({
        required: false,
        nullable: true,
    })
    cost: number;


    @ApiProperty({
        required: false,
        nullable: true,
    })
    recurrence: boolean;
}