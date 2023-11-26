import { Body, Controller, Get, Post, UseInterceptors, UsePipes, ValidationPipe, UploadedFile, Param, Put, Session, Delete, HttpException, HttpStatus, UseGuards   } from '@nestjs/common';
import { CustomerProfileEntity, PaymentsEntity, ConfirmedBookingsEntity } from './customer.entity';
import { customerService } from './customer.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError,diskStorage } from 'multer';
import { CustomerProfileDTO, PaymentsDTO, ConfirmedBookingsDTO } from './customer.dto';
import { SessionGuard } from './customer.guard';
import { MailerService } from '@nestjs-modules/mailer';
 
 
@Controller('customer')
export class customerController
 
     {
 
 
      constructor(private readonly customerService: customerService,
        private readonly mailerService: MailerService,) {}
 
      @Post('upload')
      @UseInterceptors(FileInterceptor('file',
      { fileFilter: (_req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
          cb(null, true);
        else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      }
      },
      limits: { fileSize: 3000000 },
        storage:diskStorage({
        destination: './uploads',
        filename: function (_req, file, cb) {
        cb(null,Date.now()+file.originalname)
      },
      })
      }))
      uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
     
       }
 
 //create new customer
@Post('createcustomer')
@UsePipes(new ValidationPipe())
async create(@Body() customerEntity:CustomerProfileEntity): Promise<CustomerProfileEntity> {
  return await this.customerService.createCustomer(customerEntity)
}
 
  @Get('getIndex')
  async getAll(): Promise<CustomerProfileEntity[]> {
    const res = await this.customerService.getAll();
    console.log('res=res',res);
    return res; //await this.customerService.getAll();
  }
 
  @Get('getbyid/id')
  async getCustomerById(@Param('id') customerID: number): Promise<CustomerProfileEntity> {
    return this.customerService.findById(customerID);
  }
 
  @Delete('/deleteCustomer/:customerID')
  async deletecustomer(@Param('customerID') customerID: number): Promise<void> {
    return this.customerService.deletecustomer(customerID);
  }
 
  @Put('update/:customerID') // Update the route path to include the customerID parameter
  async updateCustomer(
    @Param('customerID') customerID: number,
    @Body() customerDTO: CustomerProfileDTO,
  ): Promise<CustomerProfileEntity> {
    return this.customerService.updateCustomer(customerID, customerDTO);
  }
 
  //TourPackages
  @Post('createTourPackage')
  async createTourPackage(@Body() confirmedBookingsDTO: ConfirmedBookingsDTO): Promise<ConfirmedBookingsEntity> {
    return this.customerService.createTourPackage(confirmedBookingsDTO);
  }
 
  @Get('/getTourPackages')
  @UseGuards(SessionGuard)
  async getTourPackages(): Promise<ConfirmedBookingsEntity[]> {
    return this.customerService.getTourPackages();
  }
 
  @Get('/getTourPackageById/:bookingID')
  @UseGuards(SessionGuard)
  async getTourPackageById(@Param('tourPackageID') bookingID: number): Promise<ConfirmedBookingsEntity> {
    return this.customerService.getTourPackageById(bookingID);
  }
 
  @Put('/updateTourPackage/:bookingID')
  @UseGuards(SessionGuard)
  async updateTourPackage(
    @Param('bookingID') bookingID: number,
    @Body() confirmedBookingsDTO: ConfirmedBookingsDTO,
  ): Promise<ConfirmedBookingsEntity> {
    return this.customerService.updateTourPackage(bookingID, confirmedBookingsDTO);
  }
 
  @Delete('/deleteTourPackage/:bookingID')
  @UseGuards(SessionGuard)
  async deleteTourPackage(@Param('tourPackageID') bookingID: number): Promise<void> {
    return this.customerService.deleteTourPackage(bookingID);
  }
 
 
  @Post('login')
async login(@Body() credentials: CustomerProfileDTO, @Session() session) {
  try {
    if (await this.customerService.login(credentials)) {
      session.email = credentials.email; // Set the email in the session
      return { message: 'Login successful' };
    }
  } catch (error) {
    throw new HttpException('UnauthorizedException', HttpStatus.UNAUTHORIZED)
  }
}
 
@Post('sendemail')
async sendEmail() {
  try {
    const result = await this.mailerService.sendMail({
      to: 'farhatuktuki@gmail.com', // Recipient's email address
      subject: 'Test Email', // Email subject
      text: 'This is a test email.', // Email content
    });
    return { message: 'Email sent successfully', result };
  } catch (error) {
    console.error('Email sending failed:', error.message || error);
    throw new Error('Email sending failed');
  }
}
 
 
 
 
}