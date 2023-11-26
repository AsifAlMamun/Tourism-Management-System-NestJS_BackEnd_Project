import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, Session, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { EmployeeForm } from "./DTOs/EmployeeForm.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterError, diskStorage } from "multer";
import { EmployeeService } from "./EmployeeService.services";
import { EmployeeEntity } from "./Entities/EmployeeEntity.entity";
import { PackageEntity } from "src/Admin/Entities/PackageEntity.entity";
import { EmployeeSessionGuard } from "./EmployeeSession.guard";
import { HotelForm } from "./DTOs/HotelFrom.dto";
import { HotelEntity } from "./Entities/HotelEntity.entity";
import { TravelGuideEntity } from "./Entities/TravelGuideEnity.entity";
import { TravelGuideForm } from "./DTOs/TravelGuideFrom.dto";
import { TransportEntity } from "./Entities/TransportEntity.entity";
import { TransportFrom } from "./DTOs/TransportFrom.dto";



@Controller('employee')
export class EmployeeController {
  constructor(private readonly EmployeeService: EmployeeService) {}

    //SIGN IN FOR EMPLOYEE
    @Post('/signin')
    async signin(@Session() session, @Body() mydto:EmployeeForm)
    {
        try {
            const result = await this.EmployeeService.signin(mydto);
        
            if (result === 1) {
              session.username = mydto.username;
              console.log(session.username);

              return { message: "User Login Successful." };

            } 
            else {

              return { message: "Invalid email or password." };

            }
          } catch (error) {
            throw new HttpException(
              {
                status: HttpStatus.BAD_REQUEST,
                error: 'An error occurred during sign-in.',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
    }

    //SIGN OUT FOR EMPLOYEE
    @Get('/signout')
    signout(@Session() session) {
        try {
            if (session != null) {
                
                if (session.destroy()) {
                    return { message: "You are logged out." };
                } 
                else {
                    throw new UnauthorizedException("You are not authorized to sign-out.");
                }
            } 
            else {
                return { message: "You are already logged out." };
            }
        } catch (error) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred during sign-out.',
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
   
    //ALL EMPLOYEE 
    @Get('/Employeelist')
    async getAllEmployee() : Promise<any>{
        try{
            const result = await this.EmployeeService.getAll();
            return {message:"Employee list:", result};
        }catch(error){
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'No Employee list found.'
            },
            HttpStatus.NOT_FOUND,
            );
        }
    }
 
    
    //EMPLOYEE CHECK BY ID
    @Get('/getadminby/:id')
    getEmployeeById(@Param('id', ParseIntPipe) id: number): Promise<EmployeeEntity> {

        return this.EmployeeService.getEmployeeByID(id);
    }

            

 //CREATE NEW Employee
 @Post('/createEmployee')
 @UsePipes(new ValidationPipe())
 @UseInterceptors(FileInterceptor('profilepic',
 { fileFilter: (req, file, cb) => {
  if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
   cb(null, true);
  else {
   cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
   }
  },
  limits: { fileSize: 3000000000 },
  storage:diskStorage({
  destination: './upload',
  filename: function (req, file, cb) {
   cb(null,Date.now()+file.originalname)
  },
  })
    }))
    async addEmployee(@Body() employeedto:EmployeeForm, @UploadedFile()  myfile: Express.Multer.File) {
      employeedto.filename = myfile.filename;
        try {
            const result = await this.EmployeeService.addEmployee(employeedto);
            return { message: "Employee created Successfully", result };
          } catch (error) {
            throw new HttpException(
                {
                  status: HttpStatus.BAD_REQUEST,
                  error: 'Failed to create Employee.',
                },
                HttpStatus.BAD_REQUEST,
              );
          }
    }


   
    //UPDATE EMPLOYEE DETAILS
    @Put('/updateEmployee/:id')
    @UseGuards(EmployeeSessionGuard)
    @UsePipes(new ValidationPipe())
    updateEmployee(@Param('id') id: number, @Body() employeeEntity: EmployeeEntity) {
      return this.EmployeeService.updateEmployee(id, employeeEntity);
    }
    
    

    //DELETE EMPLOYEE 
    @Delete('/deleteEmployee/:id')
    deleteEmployee(@Param('id') id:number){
    const result = this.EmployeeService.deleteEmployee(id);

    if (result) {
    return { message: `Employee deleted successfully.` };
   } else {
  
      return { message: `Employee not found.` };
} 
}



//FILE UPLOAD API
@Post('/imageupload')
    @UseInterceptors(FileInterceptor('myfile',{ fileFilter: (req, file, cb) => 
        {
            if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
            cb(null, true);
            else {
                cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
            }
        },
        limits: { fileSize: 3000000 },
        storage:diskStorage({
            destination: './Uploads_Image',
            filename: function (req, file, cb) {
                cb(null,Date.now()+file.originalname)
            },
        })
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
        return file;
    }

  
    

    //CHECK MAILER
    @Post('/employeesendemail')
    sendEmail(@Body() mydata){
        return this.EmployeeService.sendEmail(mydata);
    }


   
    //CREATE NEW HOTEL
    @Post('/createhotel')
    @UsePipes(new ValidationPipe())
    async addhotel(@Body() hoteldto: HotelEntity) {
        try{
            const result = await this.EmployeeService.addhotel(hoteldto);
            return { message: "Created Successfully", result };

        } catch (error) {
          throw new HttpException(
              {
                status: HttpStatus.FORBIDDEN,
                error: 'Failed to create Hotel.',
              },
              HttpStatus.FORBIDDEN,
            );
        }
    }



     //UPDATE HOTEL DETAILS
    @Put('/updatehotel/:id')
    @UsePipes(new ValidationPipe())
    updatehotel(@Param('id') id:number, @Body() hoteldto:HotelForm){

        return this.EmployeeService.updatehotel(id,hoteldto);
    }



    //CHECK HOTEL DETAILS BY ID
    @Get('/gethotelby/:id')
    gethotelByID(@Param('id', ParseIntPipe) id: number): Promise<HotelEntity> {

        return this.EmployeeService.gethotelByID(id);
    }
    
    
    //CHECK ALL CREATED HOTEL
    @Get('/Hotellist')
    async getAllhotel() : Promise<any>{
        try{
            const result = await this.EmployeeService.getAllhotel();
            return {message:"Hotel list:", result};
        }catch(error){
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'No list list found.'
            },
            HttpStatus.NOT_FOUND,
            );
        }
    }



      //DELETE HOTEL FROM DATABASE BY ID
      @Delete('/deletehotel/:id')
      deletehotel(@Param('id') id:number){
          const result = this.EmployeeService.deletehotel(id);
      
      if (result) {
        return { message: `hotel with ID ${id} deleted successfully.` };
      } else {
        
        return { message: `hotel with ID ${id} not found.` };
      } 
      }


     
       //CREATE NEW TRAVELGUIDE
      @Post('/addTravelguide')
      @UsePipes(new ValidationPipe())
      async addTravelguide(@Body() travelguidedto: TravelGuideEntity) {
          try{
              const result = await this.EmployeeService.addTravelguide(travelguidedto);
              return { message: "Created Successfully TravelGuide", result };
  
          } catch (error) {
            throw new HttpException(
                {
                  status: HttpStatus.FORBIDDEN,
                  error: 'Failed to create Guide.',
                },
                HttpStatus.FORBIDDEN,
              );
          }
      }
     

      
    //UPDATE TRAVELGUIDE DETAILS
    @Put('/updateTravelguide/:id')
    @UsePipes(new ValidationPipe())
    updateTravelguide(@Param('id') id:number, @Body() travelguidedto:TravelGuideForm){

        return this.EmployeeService.updateTravelguide(id,travelguidedto);
    }
     

    //CHECK TRAVELGUIDE DETAILS BY ID
    @Get('/getTravelguideby/:id')
    getTravelByID(@Param('id', ParseIntPipe) id: number): Promise<TravelGuideEntity> {

        return this.EmployeeService.getTravelByID(id);
    }


   //CHECK ALL TRAVELGUIDE DETAILS
    @Get('/allTravelGuide')
    async getAllTravelGuide() : Promise<any>{
        try{
            const result = await this.EmployeeService.getAllTravelGuide();
            return {message:"TravelGuide list:", result};
        }catch(error){
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'No TravelGuide list found.'
            },
            HttpStatus.NOT_FOUND,
            );
        }
    }

 
   //DETELE TRAVELGUIDE BY ID

    @Delete('/deleteGuide/:id')
    deleteTravelGuide(@Param('id') id:number){
        const result = this.EmployeeService.deleteTravelGuide(id);
    
    if (result) {
      return { message: `Guide with ID ${id} deleted successfully.` };
    } else {
      
      return { message: `Guide with ID ${id} not found.` };
    } 
    }

    
    //CREATE NEW TRANSPORT
    @Post('/createtransport')
    @UsePipes(new ValidationPipe())
    async addTransport(@Body() transportdto: TransportEntity) {
        try{
            const result = await this.EmployeeService.addTransport(transportdto);
            return { message: "Created Successfully", result };

        } catch (error) {
          throw new HttpException(
              {
                status: HttpStatus.FORBIDDEN,
                error: 'Failed to create Transport.',
              },
              HttpStatus.FORBIDDEN,
            );
        }
    }
     

      //UPDATED TRANSPORT DETAILS BY ID
    @Put('/updateTransport/:id')
    @UsePipes(new ValidationPipe())
    updateTransport(@Param('id') id:number, @Body() transportdto:TransportFrom){

        return this.EmployeeService.updateTransport(id,transportdto);
    }
     
     

    //CHECK TRANSPORT DETAILS BY ID
    @Get('/getTransportByID/:id')
    getTransportByID(@Param('id', ParseIntPipe) id: number): Promise<TransportFrom> {

        return this.EmployeeService.getTransportByID(id);
    }
    


    //SHOW ALL TRANSPORTS DETAILS
    @Get('/allTransport')
    async getAllTransport() : Promise<any>{
        try{
            const result = await this.EmployeeService.getAllTransport();
            return {message:"Tatal Transport active:", result};
        }catch(error){
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'No Transport active found.'
            },
            HttpStatus.NOT_FOUND,
            );
        }
    }
      

   
    

    @Delete('/deleteTransport/:id')
    deleteTransport(@Param('id') id:number){
        const result = this.EmployeeService.deleteTransport(id);
    
    if (result) {
      return { message: `Transport deleted successfully.` };
    } else {
      
      return { message: `Transport not found.` };
    } 
    }
    
}


