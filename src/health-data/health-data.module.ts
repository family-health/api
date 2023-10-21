import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { FamilyModule } from 'src/family/family.module';
import { WatchHealthDatum } from './entities';
import { HealthDataController } from './health-data.controller';
import { HealthDataService } from './health-data.service';
import { Family } from 'src/family/entities';

@Module({
  controllers: [HealthDataController],
  providers: [HealthDataService],
  imports: [AuthModule,FamilyModule,TypeOrmModule.forFeature([WatchHealthDatum]),EmailModule,TypeOrmModule.forFeature([Family]),]
})
export class HealthDataModule { }
