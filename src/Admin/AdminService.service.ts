import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminEntity } from "./Entities/AdminEntity.entity";
import { Repository } from "typeorm";
import { AdminForm } from "./DTOs/AdminForm.dto";
import * as bcrypt from 'bcrypt';
import { MailerService } from "@nestjs-modules/mailer/dist";
import { ContentEntity } from "./Entities/ContentEntity.entity";
import { ContentForm } from "./DTOs/ContentForm.dto";
import { PackageEntity } from "./Entities/PackageEntity.entity";
import { PackageForm } from "./DTOs/PackageFrom.dto";
import { DestinationEntity } from "./Entities/DestinationEntity.entity";
import { DestinationForm } from "./DTOs/DestinationForm.dto";

@Injectable()
export class AdminService{
    constructor(
        @InjectRepository(AdminEntity)  
        private adminRepo: Repository<AdminEntity>,
        private readonly mailerService: MailerService,

        @InjectRepository(ContentEntity)
        private contentRepo: Repository<ContentEntity>,

        @InjectRepository(PackageEntity) 
        private packageRepo: Repository<PackageEntity>,

        @InjectRepository(DestinationEntity)
        private destinationRepo: Repository<DestinationEntity>

      ){}

      async getAll(): Promise<AdminEntity[]>{
        return this.adminRepo.find();
      }

      async getAdminById(id:number): Promise<AdminEntity>{
        return this.adminRepo.findOneBy({id:id});
      }

      async addAdmin(adminInfo: AdminForm): Promise<AdminEntity[]>{

        const salt = await bcrypt.genSalt();
        const hassedpassed = await bcrypt.hash(adminInfo.password, salt);
        adminInfo.password= hassedpassed;
        await this.adminRepo.save(adminInfo);
        return this.adminRepo.find();

      }

      async updateAdmin(id:number, adminInfo:AdminForm): Promise<AdminEntity>{

        const salt = await bcrypt.genSalt();
        const hassedpassed = await bcrypt.hash(adminInfo.password, salt);
        adminInfo.password= hassedpassed;
        await this.adminRepo.update(id,adminInfo);
        return this.adminRepo.findOneBy({id});

      }

      async deleteAdmin(id:number):Promise<void>{
        await this.adminRepo.delete(id); 
      }

      async sendEmail(mydata) {
        try {
          await this.mailerService.sendMail({
            to: mydata.to,
            subject: mydata.subject,
            text: mydata.text
          });

          return {message: 'Email sent successfully'};

        } catch (error) {
      
          return { message: 'Email could not be sent', error: error.message };
        }
      }

      async signin(mydto){

        const mydata= await this.adminRepo.findOneBy({email: mydto.email});
        const isMatch= await bcrypt.compare(mydto.password, mydata.password);

        if(isMatch) {
          return 1;
        }

        else {
            return 0;
        } 
      }

      async getAllContent(): Promise<ContentEntity[]>{
        return this.contentRepo.find();
      }

      async getContentById(id:number): Promise<ContentEntity>{
        return this.contentRepo.findOneBy({id:id});
      }

      async addContent(contentData: ContentForm): Promise<ContentEntity[]>{
        
        contentData.createdAt = new Date();
        contentData.createdAt.setHours(0, 0, 0, 0);

        await this.contentRepo.save(contentData);
        return this.contentRepo.find();

      }

      async updateContent(id:number, contentData: ContentForm): Promise<ContentEntity>{

        contentData.createdAt = new Date();
        contentData.createdAt.setHours(0, 0, 0, 0);

        await this.contentRepo.update(id,contentData);
        return this.contentRepo.findOneBy({id});

      }

      async deleteContent(id:number):Promise<void>{
        await this.contentRepo.delete(id); 
      }

      async getAllPackage(): Promise<PackageEntity[]>{
        return this.packageRepo.find();
      }

      async getPackageById(id:number): Promise<PackageEntity>{
        return this.packageRepo.findOneBy({id:id});
      }

      async addPackage(packageData: PackageForm): Promise<PackageEntity[]>{
        
        await this.packageRepo.save(packageData);
        return this.packageRepo.find();

      }

      async updatePackage(id:number, packageData: PackageForm): Promise<PackageEntity>{

        await this.packageRepo.update(id,packageData);
        return this.packageRepo.findOneBy({id});

      }

      async deletePackage(id:number):Promise<void>{
        await this.packageRepo.delete(id); 
      }

      async getAllDestination(): Promise<DestinationEntity[]>{
        return this.destinationRepo.find();
      }

      async getDestinationById(id:number): Promise<DestinationEntity>{
        return this.destinationRepo.findOneBy({id:id});
      }

      async searchDestinationByName(name:string): Promise<DestinationEntity>{
        return this.destinationRepo.findOneBy({name:name});
      }

      async addDestination(data: DestinationForm): Promise<DestinationEntity[]>{
        
        await this.destinationRepo.save(data);
        return this.destinationRepo.find();

      }

      async updateDestination(id:number, data: DestinationForm): Promise<DestinationEntity>{

        await this.destinationRepo.update(id,data);
        return this.destinationRepo.findOneBy({id});

      }

      async deleteDestination(id:number):Promise<void>{
        await this.destinationRepo.delete(id); 
      }

      async getAdminByContentId(id): Promise<any> 
      {
        return this.contentRepo.find({ 
          where: {id:id},
          relations: {
            admin: true,
            },
         });

        // const content = await this.contentRepo.findOne({
        //   where: { id: id },
        //   relations: ['admin'],
        // });

        // if (content && content.admin) {
        //   const { id, title, description, createdAt } = content;
        //   const { firstName, lastName } = content.admin;
      
        //   return {
        //     content: { id, title, description, createdAt },
        //     admin: { firstName, lastName },
        //   };
        // } else {
        //   return null;
        // }
        }
      
      async getContentsByAdminId(id): Promise<any> 
      {
        return this.adminRepo.find({ 
          select: {
            firstName: true,
            lastName: true,
            },
          where: {id:id},
          relations: {
              contents: true,
            },
        });
        }
      
      async getPackageByDestinationId(id): Promise<any> 
      {
        return this.destinationRepo.find({ 
          where: {id:id},
          relations: {
            package: true,
            },
          });
        }
      
      async getContentByDestinationId(id): Promise<any> 
      {
        return this.destinationRepo.find({ 
          where: {id:id},
          relations: {
            contents: true,
            },
          });
        }
      
      async index(): Promise<any> 
      {
        return this.destinationRepo.find({ 
          relations: {
            package: true,
            contents: true,
            },
          });
        }

}