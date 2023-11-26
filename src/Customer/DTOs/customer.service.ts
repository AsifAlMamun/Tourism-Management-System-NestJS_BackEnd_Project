import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { CustomerProfileEntity, PaymentsEntity, ConfirmedBookingsEntity } from './customer.entity';
import { Repository } from 'typeorm';
import { CustomerProfileDTO, PaymentsDTO, ConfirmedBookingsDTO } from './customer.dto';
import { PasswordUtil } from './Utils/bcrypt';
@Injectable()
export class customerService {
  mailerService: any;
  update(id: number, data: Partial<CustomerProfileEntity>): CustomerProfileEntity | PromiseLike<CustomerProfileEntity> {
    throw new Error('Method not implemented.');
  }
  find(): CustomerProfileEntity[] | PromiseLike<CustomerProfileEntity[]> {
    throw new Error('Method not implemented.');
  }
  findOne(customerID: number): ConfirmedBookingsEntity | PromiseLike<ConfirmedBookingsEntity> {
    throw new Error('Method not implemented.');
 
  }
 
  deleteById(customerID:number): CustomerProfileEntity | PromiseLike<CustomerProfileEntity>{
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(CustomerProfileEntity)
    private customerRepo: Repository<CustomerProfileEntity>,
    @InjectRepository(ConfirmedBookingsEntity)
    private packages: Repository<ConfirmedBookingsEntity>
  )
  {}
 
 
  // Example in the service
async getAll(): Promise<CustomerProfileEntity[]> {
  try {
    return await this.customerRepo.find();
  } catch (error) {
    // Handle the error, log it, and maybe throw a custom exception
    throw new Error(`Error fetching customer profiles: ${error.message}`);
  }
}
 
 
 
async createCustomer(customerData: CustomerProfileDTO): Promise<CustomerProfileEntity> {
  // Hash the customer's password using the utility function
  const hashedPassword = await PasswordUtil.encodePassword(customerData.password);
  customerData.password = hashedPassword;
 
  const { email } = customerData;
 
  // Check if a customer with the same email already exists
  const existingCustomer = await this.customerRepo.findOne({ where: { email } });
 
  if (existingCustomer) {
    throw new Error(`A customer with email: ${email} already exists.`);
  }
 
  const customer = this.customerRepo.create(customerData);
 
  return this.customerRepo.save(customer);
}
  async findById(customerID: number): Promise<CustomerProfileEntity> {
    return this.customerRepo.findOne({ where: { customerID: customerID }, relations: ['bookings'] });
  }
 
  async deletecustomer(customerID: number): Promise<void> {
    const cus = await this.customerRepo.findOne({ where: { customerID } });
    if (!cus) {
      throw new Error(`Customer with ID $id not found.`);
    }
    await this.customerRepo.remove(cus);
    console.log('Customer with ${id} is deleted');
  }
 
  async updateCustomer(customerID: number, customerDTO: CustomerProfileDTO): Promise<CustomerProfileEntity> {
    const customer = await this.customerRepo.findOne({ where: { customerID } });
 
    if (!customer) {
      throw new Error(`Customer with ID ${customerID} not found.`);
    }
 
    // Update the customer properties based on the DTO
    customer.fname = customerDTO.fname;
    customer.lname = customerDTO.lname;
    customer.email = customerDTO.email;
    customer.password = customerDTO.password;
    customer.travelPreferences = customerDTO.travelPreferences;
    customer.country = customerDTO.country;
 
    // Save the updated customer entity
    return this.customerRepo.save(customer);
  }
 
 
  //TourPackages
 
  async createTourPackage(ConfirmedBookingsDTO: ConfirmedBookingsDTO): Promise<ConfirmedBookingsEntity> {
    const newTourPackage = this.packages.create(ConfirmedBookingsDTO);
    return this.packages.save(newTourPackage);
  }
 
  async getTourPackages(): Promise<ConfirmedBookingsEntity[]> {
    return this.packages.find();
  }
 
  async getTourPackageById(bookingID: number): Promise<ConfirmedBookingsEntity> {
    return this.packages.findOne({ where: { bookingID } });
  }
 
  async updateTourPackage(bookingID: number, ConfirmedBookingsDTO: ConfirmedBookingsDTO): Promise<ConfirmedBookingsEntity> {
    const tourPackage = await this.packages.findOne({ where: { bookingID } });
 
    if (!tourPackage) {
      throw new Error(`Tour Package with ID ${bookingID} not found.`);
    }
 
    // Update the tour package properties based on the DTO
    tourPackage.customerID = ConfirmedBookingsDTO.customerID;
    tourPackage.tourPackageID = ConfirmedBookingsDTO.tourPackageID;
    tourPackage.departureDate = ConfirmedBookingsDTO.departureDate;
    tourPackage.returnDate = ConfirmedBookingsDTO.returnDate;
    tourPackage.numberOfAdults = ConfirmedBookingsDTO.numberOfAdults;
    tourPackage.numberOfChildren = ConfirmedBookingsDTO.numberOfChildren;
    tourPackage.totalPrice = ConfirmedBookingsDTO.totalPrice;
    tourPackage.paymentStatus = ConfirmedBookingsDTO.paymentStatus;
 
    // Save the updated tour package entity
    return this.packages.save(tourPackage);
  }
 
  async deleteTourPackage(bookingID: number): Promise<void> {
    const tourPackage = await this.packages.findOne({ where: { bookingID } });
 
    if (!tourPackage) {
      throw new Error(`Tour Package with ID ${bookingID} not found.`);
    }
 
    await this.packages.remove(tourPackage);
  }
 
  async login(credentials: CustomerProfileDTO): Promise<boolean> {
    const customer = await this.customerRepo.findOne({ where: { email: credentials.email } });
 
    if (!customer) {
      throw new UnauthorizedException('customer not found');
    }
 
    // Use your preferred method to compare the hashed password
    const passwordMatch = await PasswordUtil.comparePassword(credentials.password, customer.password);
 
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }
 
    return true;
  }
 
  async sendEmail() {
    try {
      const result = await this.mailerService.sendMail({
        to: 'farhatuktuki@gmail.com', // Recipient's email address
        subject: 'Test Email', // Email subject
        text: 'This is a test email.', // Email content
      });
      console.log('Email sent:', result);
    } catch (error) {
      console.error('Email sending failed:', error);
    }
  }
 
 
 
}