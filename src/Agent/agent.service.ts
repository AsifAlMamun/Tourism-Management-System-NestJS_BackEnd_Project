import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { agentEntity, agentbookingsEntity, agenttourPackagesEntity } from './agent.entity'; 
import { Repository } from 'typeorm';
import { agentDTO, bookingsInfo, tourPackagesInfo } from './agent.dto'; 
import { PasswordUtil } from './Utils.ts/bcrypt';


@Injectable()
export class agentService {
  findOne(id: number): agentEntity | PromiseLike<agentEntity> {
    throw new Error('Method not implemented.');
  
  }
  
  find(): agentEntity[] | PromiseLike<agentEntity[]> {
    throw new Error('Method not implemented.');
  }
  findtour(): agenttourPackagesEntity[] | PromiseLike<agenttourPackagesEntity[]> {
    throw new Error('Method not implemented.');
  }


  
  
  
  constructor(
    @InjectRepository(agentEntity) 
    private agentRepo: Repository<agentEntity>,
    @InjectRepository(agenttourPackagesEntity)
    private agentPackagesRepo:Repository<agenttourPackagesEntity>,
    @InjectRepository(agentbookingsEntity)  
    private agentBookingsRepo:Repository<agentbookingsEntity>
    )
  
  {}


//CREATE NEW AGENT
async createAgent(agentData: agentDTO): Promise<agentEntity> {
  // Hash the agent's password using the utility function
  const hashedPassword = await PasswordUtil.encodePassword(agentData.password);
  agentData.password = hashedPassword;

  const { email } = agentData;

  // Check if an agent with the same email already exists
  const existingAgent = await this.agentRepo.findOne({ where: { email } });

  if (existingAgent) {
    throw new Error('An agent with the same email already exists.');
  }

  const agent = this.agentRepo.create(agentData);

  return this.agentRepo.save(agent);
}

async addTourPackages(tourPackages:tourPackagesInfo):Promise<agenttourPackagesEntity[]>
{
 const res = await this.agentPackagesRepo.save(tourPackages);
 return this.agentPackagesRepo.find();
}

//Get all AGENTS
getAll(): Promise<agentEntity[]> {
  return this.agentRepo.find(
    {
      select:{
        id:true,
        name: true,
        email:true,
        address:true
      
      }
      
    }
  );
}

async getAllTourPackages(): Promise<agenttourPackagesEntity[]> {
  return this.agentPackagesRepo.find();
}





//Update Agent by id
async updateAgent(id: number, agentDTO: agentDTO): Promise<agentEntity> {
  const agent = await this.agentRepo.findOne({ where: { id } });
  if (!agent) {
    throw new Error(`Agent with ID ${id} not found.`);
  }
  agent.name = agentDTO.name;
  agent.email = agentDTO.email;
  agent.password = agentDTO.password;
  

  return this.agentRepo.save(agent); 
}


//DELETE AGENT
async deleteAgent(id: number): Promise<void> {
  const agent = await this.agentRepo.findOne({ where: { id } });
  if (!agent) {
    throw new Error(`Agent with ID $id not found.`);
  }
  await this.agentRepo.remove(agent);
  console.log('Agent with ${id} is deleted');
}


async deleteTourPackage(tourId: number): Promise<void> {
  // Delete the tour package based on tour_id
  await this.agentPackagesRepo.delete({ tour_id: tourId });
}



//Create Bookings
async addbookings(bookings: bookingsInfo): Promise<agentbookingsEntity> {
  const res = await this.agentBookingsRepo.save(bookings);
  return res;
}

//Login using agentDTO
async login(credentials: agentDTO): Promise<boolean> {
  const agent = await this.agentRepo.findOne({ where: { email: credentials.email } });

  if (!agent) {
    throw new UnauthorizedException('Agent not found');
  }

  // Use your preferred method to compare the hashed password
  const passwordMatch = await PasswordUtil.comparePassword(credentials.password, agent.password);

  if (!passwordMatch) {
    throw new UnauthorizedException('Invalid password');
  }

  return true;
}

//Get tour packages by creator_id
async getTourPackagesByCreatorId(creatorId: number): Promise<agenttourPackagesEntity[]> {
  return this.agentPackagesRepo.find({
    where: { creator_id: creatorId },
  });
}


}