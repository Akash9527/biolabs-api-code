import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AddProductTypeDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    productTypeName: string;

    @ApiProperty({
        required: false,
        nullable: true,
    })
    createdBy: number;

    @ApiProperty({
        required: false,
        nullable: true,
    })
    modifiedBy: number;
}