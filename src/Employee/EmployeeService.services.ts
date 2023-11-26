import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmployeeForm } from "./DTOs/EmployeeForm.dto";
import { EmployeeEntity } from "./Entities/EmployeeEntity.entity";
import { MailerService } from "@nestjs-modules/mailer/dist";
import { HotelEntity } from "./Entities/HotelEntity.entity";
import { TravelGuideEntity } from "./Entities/TravelGuideEnity.entity";
import * as bcrypt from 'bcrypt';
import { HotelForm } from "./DTOs/HotelFrom.dto";
import { TravelGuideForm } from "./DTOs/TravelGuideFrom.dto";
import { TransportEntity } from "./Entities/TransportEntity.entity";
import { TransportFrom } from "./DTOs/TransportFrom.dto";


@Injectable()
export class EmployeeService {
  
  constructor(
    @InjectRepository(EmployeeEntity) 
    private EmployeeRepo: Repository<EmployeeEntity>,
    @InjectRepository(HotelEntity)
    private HotelRepo:Repository<HotelEntity>,
    @InjectRepository(TravelGuideEntity)  
    private TravelGuideRepo:Repository<TravelGuideEntity>,
    @InjectRepository(TransportEntity) 
    private TransportRepo: Repository<TransportEntity>,
    
    private readonly mailerService: MailerService,
    
  )
  {}


  getAll(): Promise<EmployeeEntity[]> {
    return this.EmployeeRepo.find({ relations: ['hotels', 'travelGuides'] })
  }



  getEmployeeByID(id:number): Promise<any> 
   // return this.EmployeeRepo.findOneBy({id:id});
   {
    return this.EmployeeRepo.find({ 
      where: {id:id},
      relations: {
        hotels: true,
        travelGuides: true

        },
     });

    }


    //CREATE NEW Employee
    async addEmployee(employeedto: EmployeeForm): Promise<EmployeeEntity[]>{

      const salt = await bcrypt.genSalt();
      const hassedpassed = await bcrypt.hash(employeedto.password, salt);
      employeedto.password= hassedpassed;
      await this.EmployeeRepo.save(employeedto);
      return this.EmployeeRepo.find();

    }




    updateEmployee(id:number, employeedto:EmployeeForm):Promise<EmployeeEntity>
    {
     const res=  this.EmployeeRepo.update(id,employeedto);
  
       return this.EmployeeRepo.findOneBy({id});
    }



    async deleteEmployee(id:number):Promise<void>{
      await this.EmployeeRepo.delete(id); 
    }




async signin(mydto){

  const mydata= await this.EmployeeRepo.findOneBy({username: mydto.username});
  const isMatch= await bcrypt.compare(mydto.password, mydata.password);

  if(isMatch) {
    return 1;
  }

  else {
      return 0;
  } 
}



  
    async sendEmail(mydata) {
      try {
        const result = await this.mailerService.sendMail({
          to: mydata.to,
          subject: mydata.subject,
          text: mydata.text
        });

        return {message: 'Email sent successfully'};

      } catch (error) {
    
        return { message: 'Email could not be sent', error: error.message };
      }
    }





    async addhotel(hoteldto: HotelForm): Promise<HotelEntity[]>{

      await this.HotelRepo.save(hoteldto);
      return this.HotelRepo.find();

    }

   async updatehotel(id:number, hoteldto: HotelForm): Promise<HotelEntity>{


      await this.HotelRepo.update(id,hoteldto);
      return this.HotelRepo.findOneBy({id});

    }


    

   


    
    gethotelByID(id:number): Promise<any> {

      return this.HotelRepo.find({ 
        where: {id:id},
        relations: {
          employee: true
  
          },
       });
    }




    async getAllhotel(): Promise<HotelEntity[]>{
      return this.HotelRepo.find({ relations: ['employee'] });
    }



    async deletehotel(id:number):Promise<void>{
      await this.HotelRepo.delete(id); 
    }




    async addTravelguide(travelguidedto: TravelGuideForm): Promise<TravelGuideEntity[]>{

      await this.TravelGuideRepo.save(travelguidedto);
      return this.TravelGuideRepo.find();

    }




    
   async updateTravelguide(id:number, travelguidedto: TravelGuideForm): Promise<TravelGuideEntity>{


    await this.TravelGuideRepo.update(id,travelguidedto);
    return this.TravelGuideRepo.findOneBy({id});

  }




  getTravelByID(id:number): Promise<any> {


    return this.TravelGuideRepo.find({ 
      where: {id:id},
      relations: {
        guide: true,
        package: true

        },
     });
    }




    async getAllTravelGuide(): Promise<TravelGuideEntity[]>{
      return this.TravelGuideRepo.find({ relations: ['guide', 'package'] });
    }




    async deleteTravelGuide(id:number):Promise<void>{
      await this.TravelGuideRepo.delete(id); 
    }

 
    
    
    async addTransport(transportdto: TransportFrom): Promise<TransportEntity[]>{

      await this.TransportRepo.save(transportdto);
      return this.TransportRepo.find();

    }
    



    async updateTransport(id:number, transportdto: TransportFrom): Promise<TransportEntity>{


      await this.TransportRepo.update(id,transportdto);
      return this.TransportRepo.findOneBy({id});
  
    }



    getTransportByID(id:number): Promise<TransportEntity> {
      return this.TransportRepo.findOneBy({id:id});
      }
   



      async getAllTransport(): Promise<TransportEntity[]>{
        return this.TransportRepo.find();
      }





      async deleteTransport(id:number):Promise<void>{
        await this.TransportRepo.delete(id); 
      }


      
}