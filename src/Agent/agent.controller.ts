import { Body, Controller, Get, Query, Param, Post, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, Res, Put, Delete, Session, HttpException, HttpStatus, UseGuards, UnauthorizedException } from '@nestjs/common';
import { agentDTO, bookingsInfo, tourPackagesInfo } from './agent.dto';
import { FileInterceptor,  } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { agentService } from './agent.service';
import { agentEntity, agentbookingsEntity, agenttourPackagesEntity} from './agent.entity';
import { SessionGuard } from './agent.guard';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: agentService) {}
  

    @Get('id')
    getHello(): string {
      return "hello Mars";
    }
    

    @Get('/searchuserbyquery')
    searchUserByQuery(@Query()myquery:object):object{
        return myquery
    }

@Post('uploadImage')  
@UseInterceptors(FileInterceptor('file',
{ fileFilter: (req, file, cb) => {
if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
cb(null, true);
else {
cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
}
},
limits: { fileSize: 3000000 },
storage:diskStorage({
destination: './uploads',
filename: function (req, file, cb) {
cb(null,Date.now()+file.originalname)
},
})
}))
uploadFile(@UploadedFile() file: Express.Multer.File) {
console.log(file);
}

//DB related controllers
@Get('/getimage/:name')  //localhost:3000/agent/getimage/name.png GET
getImages(@Param('name') name:string, @Res() res) {
res.sendFile(name,{ root: './uploads' })
}



//CREATE NEW AGENTs
@Post('create')
@UsePipes(new ValidationPipe())
async createAgent(@Body() agentData: agentDTO): Promise<agentEntity> {
  return this.agentService.createAgent(agentData);
}



//Get All Agents
@Get('agentindex')
getIndex(@Session() session) {
  return this.agentService.getAll();
  
}



//Get all tour packages
@Get('getpackages')
@UseGuards(SessionGuard)
getAllTourPackages(): Promise<agenttourPackagesEntity[]> {
  return this.agentService.getAllTourPackages();
}

//Update Agent by id
@Put('/update/:id')
@UsePipes(new ValidationPipe())
updateAdmin(@Param('id') id: number, @Body() agentInfo: agentDTO) {
  return this.agentService.updateAgent(id, agentInfo);
}


//DELETE AGENTS
@Delete('/delete/:id')
async deleteAgent(@Param('id') id: number): Promise<void> {
  return this.agentService.deleteAgent(id);
}
//CREATE NEW TOUR PACKAGES
@Post('addtourpackage') // Define the POST route for adding tour packages
  @UsePipes(new ValidationPipe()) // You can use validation if needed
  async addTourPackages(@Body() tourPackages: tourPackagesInfo): Promise<agenttourPackagesEntity[]> {
    // Call the service method to add tour packages and return the updated list
    const updatedTourPackages = await this.agentService.addTourPackages(tourPackages);
    return updatedTourPackages;
  }


@Post('addbookings')
@UsePipes(new ValidationPipe())
async addbookings(@Body() bookings: bookingsInfo): Promise<agentbookingsEntity> {
  return this.agentService.addbookings(bookings);
}

@Delete('tour-packages/:tourId')     //localhost:3000/agent/tour-packages/3
async deleteTourPackage(@Param('tourId') tourId: number): Promise<void> {
  return this.agentService.deleteTourPackage(tourId);
}


@Post('login')
async login(@Body() credentials: agentDTO, @Session() session) {
  try {
    if (await this.agentService.login(credentials)) {
      session.email = credentials.email; // Set the email in the session
      return { message: 'Login successful' };
    }
  } catch (error) {
    throw new UnauthorizedException('Invalid login credentials');
  }
}
//Get tour packages by creator_id
@Get('creator/:id')
  getTourPackagesByCreatorId(@Param('id') creatorId: number): Promise<agenttourPackagesEntity[]> {
    return this.agentService.getTourPackagesByCreatorId(creatorId);
  }

}
