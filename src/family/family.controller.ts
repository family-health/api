import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { FamilyService } from './family.service';
import { CreateFamilyDto, UpdateFamilyDto } from './dto';
import { PaginationDto } from 'src/common/dto';
import { UuidV4Pipe } from 'src/common/pipes';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('family')
@ApiTags('Family')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) { }

  @Post()
  @Auth(ValidRoles.user)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new' })
  create(@Body() createFamilyDto: CreateFamilyDto) {
    return this.familyService.create(createFamilyDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get All' })
  @Auth(ValidRoles.user)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.familyService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find by Id' })
  @Auth(ValidRoles.user)
  findOne(@Param('id', UuidV4Pipe) id: string) {
    return this.familyService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update by Id' })
  @Auth(ValidRoles.user)
  update(@Param('id', UuidV4Pipe) id: string, @Body() updateFamilyDto: UpdateFamilyDto) {
    return this.familyService.update(id, updateFamilyDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete by Id' })
  @Auth(ValidRoles.user)
  remove(@Param('id', UuidV4Pipe) id: string) {
    return this.familyService.remove(id);
  }
}
