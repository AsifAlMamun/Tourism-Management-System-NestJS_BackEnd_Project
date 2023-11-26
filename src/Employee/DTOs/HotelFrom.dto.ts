import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class HotelForm{

    @IsNotEmpty()
    HotelName: string;

    @IsNumber()
    Rating: string;
    
    @IsString()
    PriceRange: string;

    Address: string;

    Description: string;

}
