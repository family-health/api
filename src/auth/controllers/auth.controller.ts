import { Body, Controller, Delete, Get, Headers, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { AuthService } from '../services';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '../dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IncomingHttpHeaders } from 'http';
import { UAParser } from 'ua-parser-js';
import { HeadersRequest } from '../interfaces';


@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  @ApiOperation({ summary: 'Register new User' })
  register(@Body() createUserDto: CreateUserDto, @Headers() headers: IncomingHttpHeaders) {
    const parser = new UAParser();
    const userAgent = headers['user-agent'];
    const result: HeadersRequest = parser.setUA(userAgent).getResult();
    return this.authService.create(createUserDto, result);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Authenticates the user' })
  login(@Body() loginUserDto: LoginUserDto, @Headers() headers: IncomingHttpHeaders) {
    const parser = new UAParser();
    const userAgent = headers['user-agent'];
    const result: HeadersRequest = parser.setUA(userAgent).getResult();
    return this.authService.login(loginUserDto, result);
  }


}
