import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { AuthService } from '../services';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '../dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  @ApiOperation({ summary: 'Register new User' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Authenticates the user' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
