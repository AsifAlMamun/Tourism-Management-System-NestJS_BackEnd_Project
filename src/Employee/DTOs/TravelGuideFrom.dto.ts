import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TravelGuideForm{

    @IsNotEmpty()
    DestinationName: string;

    @IsString()
    Address: string;
    
    Description: string;
    
    @IsString()
    GuideName: string;

   
    Contact : string;

    @IsString()
    PackageName : string;
    
    @IsString()
    Price: string;

}
