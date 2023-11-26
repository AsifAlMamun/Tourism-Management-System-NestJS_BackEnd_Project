import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class TransportFrom{


 
    @IsNotEmpty()
    name: string;
    @IsString()
    description: string;
    @IsNumber()
    capacity: number;
    @IsNotEmpty()
    availability: boolean;
    @IsNumber()
    cost: number;
    @IsString()
    departurePoint: string;
    @IsString()
    arrivalPoint: string;
    @IsString()
    schedule: string;
    @IsString()
    facilities: string;

}