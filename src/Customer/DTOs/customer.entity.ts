import { IsEmail, IsNumber, IsString } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
 
@Entity("Customer")
export class CustomerProfileEntity{
    @PrimaryGeneratedColumn() @IsNumber()
    customerID:number;
    @Column() @IsString()
    fname: string;
    @Column() @IsString()
    lname: string;
    @Column() @IsEmail() @Unique(["email"])
    email:string;
    @Column() @IsString()
    password:string;
    @Column() @IsString()
    country:string;
    @Column() @IsString()
    travelPreferences:string;
    @OneToMany(() => ConfirmedBookingsEntity, (bookings) => bookings.customer, { cascade:true, onDelete:"CASCADE"})
    bookings: ConfirmedBookingsEntity[];
   
    @OneToMany(() => PaymentsEntity, (payments) => payments.customer, { cascade:true, onDelete:"CASCADE"})
    payments: PaymentsEntity[];
  }
 
  // @Entity("CustomerTourPackages")
 
 
 
  @Entity("ConfirmedPackages")
  export class ConfirmedBookingsEntity{
    @PrimaryGeneratedColumn() @IsNumber()
    bookingID:number;
    @Column() @IsNumber()
    customerID:number;
    @Column() @IsNumber()
    tourPackageID:number;
    @Column() @IsString()
    departureDate:string;
    @Column() @IsString()
    returnDate:string;
    @Column() @IsNumber()
    numberOfAdults:number;
    @Column() @IsNumber()
    numberOfChildren:number;
    @Column() @IsNumber()
    totalPrice:number;
    @Column() @IsString()
    paymentStatus:string;  
    @ManyToOne(() => CustomerProfileEntity, (customer) => customer.bookings, {onDelete:"CASCADE"})
    @JoinColumn({ name: "customerID" })
    customer: CustomerProfileEntity;
  }
 
  @Entity("Payment")
  export class PaymentsEntity{
    @PrimaryGeneratedColumn() @IsNumber()
    paymentID: number;
    @Column() @IsNumber()
    customerID:number;
    @Column() @IsNumber()
    bookingID:number;
    @Column() @IsNumber()
    amount:number;
    @Column() @IsString()
    paymentDate:string;
    @Column() @IsString()
    paymentMethod:string;
    @ManyToOne(() => CustomerProfileEntity, (customer) => customer.payments, {onDelete:"CASCADE"})
    @JoinColumn({ name: "customerID" })
    customer: CustomerProfileEntity;
  }
  @Entity("Feedback")
  export class FeedbackEntity{
    @PrimaryGeneratedColumn() @IsNumber()
    feedbackID:number;
    @Column() @IsString()
    message:string;
    @Column() @IsString()
    rating:string;
 
  }