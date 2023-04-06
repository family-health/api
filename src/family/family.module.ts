import { Module } from '@nestjs/common';
import { FamilyService } from './family.service';
import { FamilyController } from './family.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from './entities';

@Module({
  controllers: [FamilyController],
  providers: [FamilyService],
  imports: [TypeOrmModule.forFeature([Family]),]
})
export class FamilyModule { }
