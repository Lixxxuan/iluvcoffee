/*export class UpdateCoffeeDto {
    readonly name:string;
    readonly brand:string;
    readonly flavor:string[];
}*/

import { PartialType } from "@nestjs/mapped-types";
import { CreateCoffeeDto } from "../create-coffee.dto/create-coffee.dto";

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto ){}

