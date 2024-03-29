import { Body, Controller, Get, Headers, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IncomingHttpHeaders } from 'http';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UAParser } from 'ua-parser-js';
import { CreateUserDto, LoginUserDto } from '../dto';
import { fileFilters } from '../helpers';
import { HeadersRequest } from '../interfaces';
import { AuthService } from '../services';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

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


  // @Post('signup-with-image')
  // @UseInterceptors(FileInterceptor('image', { fileFilter: fileFilters }))
  // async registerWithImage(@UploadedFile() file: Express.Multer.File, @Body() createUserDto: any, @Headers() headers: IncomingHttpHeaders) {
  //   let user = JSON.parse(createUserDto.user);

  //   const parser = new UAParser();
  //   const userAgent = headers['user-agent'];
  //   const result: HeadersRequest = parser.setUA(userAgent).getResult();

  //   if (file) {
  //     const { secure_url, public_id } = await this.cloudinaryService.uploadImageUserProfile(file);
  //     if (secure_url) {
  //       user = { ...user, avatar: secure_url, publicIdAvatar: public_id };
  //     }
  //   }

  //   return await this.authService.create(user, result);

  // }



}
