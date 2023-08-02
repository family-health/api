import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto';
import { CreateWatchHealthDatumDto } from './dto/create-watch-health-datum.dto';
import { UpdateWatchHealthDatumDto } from './dto/update-watch-health-datum.dto';
import { HealthDataService } from './health-data.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/enum';

@Controller('health-data')
export class HealthDataController {
  constructor(private readonly healthDataService: HealthDataService) { }

  @Post("/create")
  create(@Body() createWatchHealthDatumDto: CreateWatchHealthDatumDto) {
    return this.healthDataService.create(createWatchHealthDatumDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.healthDataService.findAll(paginationDto);
  }

  @Get('byuserId/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get By UserId' })
  @Auth(ValidRoles.user)
  findByIdUser(@Query() paginationDto: PaginationDto, @Param('id', ParseUUIDPipe) idUser: string) {
    return this.healthDataService.findByUserId(paginationDto, idUser);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.healthDataService.findOne(id);
  }


  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.healthDataService.remove(id);
  }
}
