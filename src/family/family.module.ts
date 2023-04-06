import { Module } from '@nestjs/common';
import { FamilyService } from './family.service';
import { FamilyController } from './family.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from './entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [FamilyController],
  providers: [FamilyService],
  imports: [AuthModule, TypeOrmModule.forFeature([Family]),]
})
export class FamilyModule { }
