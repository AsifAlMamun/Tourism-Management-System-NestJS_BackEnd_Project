import { Module } from "@nestjs/common";
import { AdminController } from "./AdminController.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminEntity } from "./Entities/AdminEntity.entity";
import { AdminService } from "./AdminService.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { ContentEntity } from "./Entities/ContentEntity.entity";
import { PackageEntity } from "./Entities/PackageEntity.entity";
import { DestinationEntity } from "./Entities/DestinationEntity.entity";

@Module({
imports:[MailerModule.forRoot({
    transport: {
    host: 'smtp.gmail.com',
    port: 465,
    ignoreTLS: true,
    secure: true,
    auth: {
    user: 'adeepto04@gmail.com',
    pass: 'srrzsjdzsxdpffzd'
    },
    }}),TypeOrmModule.forFeature([AdminEntity,ContentEntity,PackageEntity,DestinationEntity])],
controllers:[AdminController],
providers:[AdminService]
})
export class AdminModule{}