import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "../services";
import { UpdateUserDto } from "../dto";
import { UuidV4Pipe } from "src/common/pipes";
import { PaginationDto } from "src/common/dto";
import { Auth } from "../decorators";
import { ValidRoles } from "../enum";

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) { }


  @Get()
  @Auth(ValidRoles.superUser)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get All' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth(ValidRoles.user)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get By Id' })
  findOne(@Param('id', UuidV4Pipe) id: string,) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Auth(ValidRoles.user)
  @ApiOperation({ summary: 'Update By Id' })
  update(@Param('id', UuidV4Pipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.user)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete By Id' })
  delete(@Param('id', UuidV4Pipe) id: string) {
    return this.userService.delete(id);
  }
}