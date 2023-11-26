import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ComplaintsAndResolutionsEntity, agentEntity, agentbookingsEntity, agenttourPackagesEntity } from './agent.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { agentService } from './agent.service';
import { AgentController } from './agent.controller';

@Module({
  imports: [TypeOrmModule.forFeature([agentEntity, agenttourPackagesEntity, agentbookingsEntity, ComplaintsAndResolutionsEntity]),],
  controllers: [AgentController],
  providers: [AppService, agentService],
})
export class AgentModule {}