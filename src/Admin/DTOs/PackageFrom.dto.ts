import { IsNotEmpty, IsString } from "class-validator";

export class PackageForm {

    @IsString()
    @IsNotEmpty()
    name:string;

    @IsString()
    @IsNotEmpty()
    price:string;

    @IsString()
    @IsNotEmpty()
    discount:string;

    @IsString()
    @IsNotEmpty()
    duration:string;
}