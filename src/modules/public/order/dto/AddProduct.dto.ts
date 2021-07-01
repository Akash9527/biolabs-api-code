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
    @IsNotEmpty()
    recurrence: boolean;

    @ApiProperty({
        required: true,
        nullable: false,
    })
    cost: number;

    @ApiProperty({
        required: false,
        nullable: true,
    })
    description: string;

    @ApiProperty({
        required: true,
        nullable: false,
    })
    productTypeId: number;

}