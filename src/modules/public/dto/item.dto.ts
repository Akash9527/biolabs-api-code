import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class ItemDto {

    @ApiProperty({ description: 'Product Type Id', required: true, nullable: false })
    @IsNotEmpty()
    productTypeId: number;

    @ApiProperty({ description: 'Item name', required: true, nullable: false })
    @IsNotEmpty()
    itemName: string;

    @ApiProperty({ description: 'Current items quantity', required: false, nullable: true })
    currentQty: number;

    @ApiProperty({ description: 'Desired items quantity', required: false, nullable: true })
    desiredQty: number;

}