import { Equals, IsEmail, IsInt, IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";

export class AdminForm{

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    //@Equals("FirstName", { message: "Firstname do not match with username" })
    @IsNotEmpty()
    username: string;
    
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    address: string;

    //@Matches(/^[a-zA-Z]*[a-z][a-zA-Z\d]*[A-Z][a-zA-Z\d]*\d[a-zA-Z\d]*$/, { message: "Password must contain one lowercase letter, one uppercase letter and one digit"})
    @IsNotEmpty()
    password: string;

    filename:string;

}