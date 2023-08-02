import { Module } from '@nestjs/common';
import { HealthDataService } from './health-data.service';
import { HealthDataController } from './health-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchHealthDatum } from './entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [HealthDataController],
  providers: [HealthDataService],
  imports: [AuthModule,TypeOrmModule.forFeature([WatchHealthDatum])]
})
export class HealthDataModule { }
