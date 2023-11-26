import { Module } from '@nestjs/common';
import { customerController } from './customer.controller';
import { AppService } from 'src/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { customerService } from './customer.service';
import { ConfirmedBookingsEntity, CustomerProfileEntity, FeedbackEntity, PaymentsEntity } from './customer.entity';
import { MailerModule } from '@nestjs-modules/mailer';
@Module({
  imports: [TypeOrmModule.forFeature([CustomerProfileEntity, ConfirmedBookingsEntity, PaymentsEntity,FeedbackEntity ]),
 
  MailerModule.forRoot({
    transport:{
      host:'smtp.gmail.com',
      port:465,
      secure:true,
      auth:{
        user:'sf6982395@gmail.com',
        pass:'ukpw royk rhob iahz',
      }
    }, defaults:{
      from: 'sf6982395@gmail.com',
    }
  })],
  controllers: [customerController],
  providers: [AppService, customerService],
})
export class customerModule {}