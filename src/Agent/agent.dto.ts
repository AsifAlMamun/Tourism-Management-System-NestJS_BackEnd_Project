import { IsEmail, IsString, IsNotEmpty, IsNumber, IsDate, IsOptional } from "class-validator";
export class agentDTO{
    @IsString() @IsOptional()
    name: string;
    @IsNumber() @IsOptional()
    id: number;
    @IsEmail() @IsNotEmpty()
    email: string;
    @IsString() @IsNotEmpty()
    password: string;
    @IsString()@IsOptional()
    address: string;
    @IsOptional()
    file:string;
}

export class tourPackagesInfo{
    @IsNumber()
    tour_id:number;
    @IsNumber()
    creator_id:number;
    @IsString()
    from:string;
    @IsString()
    destination:string;
    @IsString()
    distance:string;
    @IsNumber()
    price:number;
    @IsString()
    transport:string;
    @IsString()
    weather_Info:string;
    @IsString()
    availability:string;
}
export class bookingsInfo{
    @IsNumber() 
    booking_number:number;
    @IsNumber() 
    tour_id:number;
    @IsString()
    tourist_name:string;
    @IsNotEmpty()
    date:string;
    @IsNumber()
    total_cost:number;
    @IsNumber()
    person:number;
}
export class ComplaintsAndResolutionsInfo {
    @IsNumber()
    booking_id: number;
    @IsString()
    tourist_Name: string;
    @IsString()
    complaint: string;
    @IsString()
    resolution: string;

}

