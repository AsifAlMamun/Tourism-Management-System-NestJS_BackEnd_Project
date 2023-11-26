import { IsEmail, IsNotEmpty,IsNumber,IsString,IsBoolean, IsOptional } from "class-validator";
 
export class CustomerProfileDTO{
  @IsNumber() @IsOptional()
  customerID:number;
  @IsString() @IsOptional()
  fname: string;
  @IsString() @IsOptional()
  lname: string;
  @IsEmail()
  email:string;
  @IsString()
  password:string;
  @IsString() @IsOptional()
  country:string;
  @IsString() @IsOptional()
  travelPreferences:string;
}
 
 
export class ConfirmedBookingsDTO{
  @IsNumber()
  bookingID:number;
  @IsNumber()
  customerID:number;
  @IsNumber()
  tourPackageID:number;
  @IsString()
  departureDate:string;
  @IsString()
  returnDate:string;
  @IsNumber()
  numberOfAdults:number;
  @IsNumber()
  numberOfChildren:number;
  @IsNumber()
  totalPrice:number;
  @IsString()
  paymentStatus:string;  
}
 
export class PaymentsDTO{
  @IsNumber()
  paymentID: number;
  @IsNumber()
  customerID:number;
  @IsNumber()
  bookingID:number;
  @IsNumber()
  amount:number;
  @IsString()
  paymentDate:string;
  @IsString()
  paymentMethod:string;
}