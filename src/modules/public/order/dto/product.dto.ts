import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AddProductDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        required: true,
        nullable: true,
    })
    cost: number;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    description: string;

}