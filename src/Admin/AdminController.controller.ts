import { Body, Controller, Delete, Get, Param, Post, Put, ParseIntPipe, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, Session, HttpException, HttpStatus, UnauthorizedException, UseGuards, Query, Res } from "@nestjs/common";
import { AdminForm } from "./DTOs/AdminForm.dto";
import { EmployeeForm } from "src/Employee/DTOs/EmployeeForm.dto";
import { ContentForm } from "./DTOs/ContentForm.dto";
import { PackageForm } from "./DTOs/PackageFrom.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterError, diskStorage } from "multer";
import { AdminService } from "./AdminService.service";
import { AdminEntity } from "./Entities/AdminEntity.entity";
import { SessionGuard } from "./Session.guard";
import { ContentEntity } from "./Entities/ContentEntity.entity";
import { PackageEntity } from "./Entities/PackageEntity.entity";
import { DestinationEntity } from "./Entities/DestinationEntity.entity";
import { DestinationForm } from "./DTOs/DestinationForm.dto";

@Controller('/admin')
export class AdminController
{
    constructor(private readonly adminService: AdminService) {}

    @Post('/signin')
    async signin(@Session() session, @Body() mydto:AdminForm)
    {
        try {
            const result = await this.adminService.signin(mydto);
        
            if (result === 1) {
              session.email = mydto.email;
              console.log(session.email);

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

    @Get('/index')
    async index() : Promise<any>{
        try{
            const result = await this.adminService.index();
            return { message: "Response Found Successfully.", result};
        }catch(error){
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'No admin list found.'
            },
            HttpStatus.NOT_FOUND,
            );
        }
    }

    @Get('/adminlist')
    async getAllAdmin() : Promise<any>{
        try{
            const result = await this.adminService.getAll();
            return {message:"Admin list retrieve successfully.", result};
        }catch(error){
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'No admin list found.'
            },
            HttpStatus.NOT_FOUND,
            );
        }
    }

    @Get('/getadminby/:id')
    async getAdminById(@Param('id', ParseIntPipe) id: number): Promise<any> {
        try{
            const result = await this.adminService.getAdminById(id);
            return {message: "Admin found successfully.", result}
        }catch(error){
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'No admin found.'
            },
            HttpStatus.NOT_FOUND,
            );
        }
    }

    @Post('/createadmin')
    @UsePipes(new ValidationPipe())
    @UseInterceptors(FileInterceptor('profilepic',
    { fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
        cb(null, true);
    else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
    }},
    limits: { fileSize: 30000 },
    storage:diskStorage({
        destination: './Uploaded_Image',
        filename: function (req, file, cb) {
            cb(null,Date.now()+file.originalname)
        },})
    }))
    async addAdmin(@Body() adminInfo:AdminForm, @UploadedFile()  myfile: Express.Multer.File) {
        adminInfo.filename = myfile.filename;
        try {
            const result = await this.adminService.addAdmin(adminInfo);
            return { message: "Admin created Successfully", result };
          } catch (error) {
            throw new HttpException(
                {
                  status: HttpStatus.BAD_REQUEST,
                  error: 'Failed to create admin.',
                },
                HttpStatus.BAD_REQUEST,
              );
          }
    }

    @Put('/updateadmin/:id')
    @UseGuards(SessionGuard)
    @UsePipes(new ValidationPipe())
    async updateAdmin(@Param('id') id:number, @Body() adminInfo:AdminForm){
        try{
            const result = await this.adminService.updateAdmin(id,adminInfo);
            return  { message: "Admin updated Successfully", result};
        }catch (error) {
            throw new HttpException(
                {
                  status: HttpStatus.FORBIDDEN,
                  error: 'Failed to update admin.',
                },
                HttpStatus.FORBIDDEN,
              );
          }
        
    }

    @Delete('/deleteadmin/:id')
    deleteAdmin(@Param('id') id:number){
        try{
        const result = this.adminService.deleteAdmin(id);
        if (result) {
            return { message: `Admin with ID ${id} deleted successfully.` };
        } else {
            return { message: `Admin with ID ${id} not found.` };
        }}catch (error) {
            throw new HttpException(
                {
                  status: HttpStatus.BAD_REQUEST,
                  error: 'Failed to delete admin.',
                },
                HttpStatus.BAD_REQUEST,
              );
          }
    }

    @Post('/imageupload')
    @UseInterceptors(FileInterceptor('myfile',{ fileFilter: (req, file, cb) => 
        {
            if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
            cb(null, true);
            else {
                cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
            }
        },
        limits: { fileSize: 30000 },
        storage:diskStorage({
            destination: './Uploaded_Image',
            filename: function (req, file, cb) {
                cb(null,Date.now()+file.originalname)
            },
        })
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
        return file;
    }

    @Get('/getprofilepic/:name')
    getProfilePicture(@Param('name') name:string, @Res() res) {
        res.sendFile(name,{ root: './Uploaded_Image' })
    }

    @Get('/contents')
    async getAllContents() : Promise<any>{
        try{
            const result = await this.adminService.getAllContent();
            return {message: "Here is the content list", result};
        }catch(error){
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'No content list found.'
            },
            HttpStatus.NOT_FOUND,
            );
        }
    }

    @Get('/content/:id')
    async getContentById(@Param('id', ParseIntPipe) id: number): Promise<any> {
        try{
            const result = await this.adminService.getContentById(id);
            return {message: "Here is the content.", result};
        }catch(error){
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'No content found.'
            },
            HttpStatus.NOT_FOUND,
            );
        }
 
    }

    @Post('/content/create')
    @UseGuards(SessionGuard)
    async createContent(@Body() contentData: ContentForm) {
        try{
            const result = await this.adminService.addContent(contentData);
            return { message: "Content created Successfully", result };
        } catch (error) {
          throw new HttpException(
              {
                status: HttpStatus.FORBIDDEN,
                error: 'Failed to create admin.',
              },
              HttpStatus.FORBIDDEN,
            );
        }
    }

    @Put('/updatecontent/:id')
    @UseGuards(SessionGuard)
    updateContent(@Param('id') id:number, @Body() contentData:ContentForm){

        return this.adminService.updateContent(id,contentData);
    }

    @Delete('/deletecontent/:id')
    deleteContent(@Param('id') id:number){
        const result = this.adminService.deleteContent(id);
    
    if (result) {
      return { message: `Content with ID ${id} deleted successfully.` };
    } else {
      
      return { message: `Content with ID ${id} not found.` };
    }
 
    }

    @Get('/packages')
    getAllPackages() :any{
        return this.adminService.getAllPackage();
    }

    @Get('/package/:id')
    getPackageById(@Param('id', ParseIntPipe) id: number): Promise<PackageEntity> {

        return this.adminService.getPackageById(id);
    }

    @Post('/package/create')
    //@UseGuards(SessionGuard)
    createPackage(@Body() packageData: PackageForm) {
    
        return this.adminService.addPackage(packageData);
    }

    @Put('/updatepackage/:id')
    @UseGuards(SessionGuard)
    updatePackage(@Param('id') id:number, @Body() packageData: PackageForm){
        return this.adminService.updatePackage(id, packageData);
    }

    @Delete('/deletepackage/:id')
    deletePackage(@Param('id') id:number){
        const result = this.adminService.deletePackage(id);
    
    if (result) {
      return { message: `Package with ID ${id} deleted successfully.` };
    } else {
      
      return { message: `Package with ID ${id} not found.` };
    } 
    }

    @Get('/destinations')
    getAllDestination() :any{
        return this.adminService.getAllDestination();
    }

    @Get('/getdestinationby/:id')
    getDestinationById(@Param('id', ParseIntPipe) id: number): Promise<DestinationEntity> {

        return this.adminService.getDestinationById(id);
    }

    @Get('/searchdestinationdyname')
    async searchDestinationByName(@Query('name') name: string): Promise<any> {
        try {
            const result = await this.adminService.searchDestinationByName(name);

            return { message: "Destination search successful.", result };
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'An error occurred during destination search.',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post('/createdestination')
    //@UseGuards(SessionGuard)
    @UsePipes(new ValidationPipe())
    @UseInterceptors(FileInterceptor('imageUrl',
    { fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
        cb(null, true);
    else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
    }},
    limits: { fileSize: 30000 },
    storage:diskStorage({
        destination: './Uploaded_Image',
        filename: function (req, file, cb) {
            cb(null,Date.now()+file.originalname)
        },})
    }))
    addDestination(@Body() destinationInfo:DestinationForm, @UploadedFile()  myfile: Express.Multer.File) {
        destinationInfo.imageUrl = myfile.filename;
        return this.adminService.addDestination(destinationInfo);
    }

    @Put('/updatedestination/:id')
    @UseGuards(SessionGuard)
    @UsePipes(new ValidationPipe())
    updateDestination(@Param('id') id:number, @Body() destinationInfo:DestinationForm){
        return this.adminService.updateDestination(id,destinationInfo);
    }

    @Delete('/deletedestination/:id')
    deleteDestination(@Param('id') id:number){
        const result = this.adminService.deleteDestination(id);
        
        if (result) {
            return { message: `Destination with ID ${id} deleted successfully.` };
        } else {
            return { message: `Destination with ID ${id} not found.` };
        }
    }

    @Post('/sendemail')
    sendEmail(@Body() mydata){
        return this.adminService.sendEmail(mydata);
    }

    @Get('findcontentsbyadmin/:id')
    getContentsByAdminId(@Param('id', ParseIntPipe) id: number): any {
        return this.adminService.getContentsByAdminId(id);
    }

    @Get('findadminbycontent/:id')
    getAdminByContentId(@Param('id', ParseIntPipe) id: number): any {
        return this.adminService.getAdminByContentId(id);
    }

    @Get('findpackagebydestination/:id')
    getPackageByDestinationId(@Param('id', ParseIntPipe) id: number): any {
        return this.adminService.getPackageByDestinationId(id);
    }

    @Get('findcontentbydestination/:id')
    getContentByDestinationId(@Param('id', ParseIntPipe) id: number): any {
        return this.adminService.getContentByDestinationId(id);
    }

    @Post('/employee/create')
    createEmployee(@Body() empData: EmployeeForm): any {
    
        return {
            message: "Admin created successfully",
            data: empData,
        };
    }

    @Get('/employee/:id')
    getEmployeeById(@Param('id') id: number): any {

        return null;
    }

    @Put('/updateemployee/:id')
    updateEmployee(){
        return 'Employee Updated Succesfully';
    }

    @Delete('/deleteemployee/:id')
    deleteEmployee(){
          return 'Employee is deleted';
    }


    @Post('/agent/create')
    createAgent(@Body() agentData: AdminForm): any {
    
        return {
            message: "Admin created successfully",
            data: agentData,
        };
    }

    @Get('/agent/:id')
    getAgentById(@Param('id') id: number): any {

        return null;
    }

    @Put('/updateagent/:id')
    updateAgent(){
        return 'Agent Updated Succesfully';
    }

    @Delete('/deleteagent/:id')
    deleteAgent(){
          return 'Agent is deleted';
    }

    @Delete('/deletecustomer/:id')
    deleteCustomer(){
          return 'Customer is deleted';
    }  

}