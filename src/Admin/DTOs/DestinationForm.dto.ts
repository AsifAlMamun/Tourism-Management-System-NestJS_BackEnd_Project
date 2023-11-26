import { IsNotEmpty, IsString } from "class-validator";

export class DestinationForm{

    @IsString()
    @IsNotEmpty()
    name:string;

    @IsString()
    @IsNotEmpty()
    description:string;

    imageUrl:string;

    @IsString()
    @IsNotEmpty()
    activities:string;
    
}