import { IsNotEmpty, IsString } from "class-validator";

export class ContentForm{
    
    @IsString()
    @IsNotEmpty()
    title:string;

    @IsString()
    @IsNotEmpty()
    description:string;

    @IsNotEmpty()
    createdAt:Date;
}