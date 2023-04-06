import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Put } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "../services";
import { UpdateUserDto } from "../dto";
import { UuidV4Pipe } from "src/common/pipes";

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) { }


  @Get()
  @ApiOperation({ summary: 'Get All' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get By Id' })
  findOne(@Param('id', UuidV4Pipe) id: string,) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update By Id' })
  update(@Param('id', UuidV4Pipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete By Id' })
  delete(@Param('id', UuidV4Pipe) id: string) {
    return this.userService.delete(id);
  }
}