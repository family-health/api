import { Body, Controller, Get, Headers, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IncomingHttpHeaders } from 'http';
import { UAParser } from 'ua-parser-js';
import { CreateUserDto, LoginUserDto } from '../dto';
import { fileFilters } from '../helpers';
import { HeadersRequest } from '../interfaces';
import { AuthService } from '../services';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

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


  @Post('signup-with-image')
  @UseInterceptors(FileInterceptor('image', { fileFilter: fileFilters }))
  async registerWithImage(@UploadedFile() file: Express.Multer.File, createUserDto: CreateUserDto, @Headers() headers: IncomingHttpHeaders) {
    let user = createUserDto;
    const parser = new UAParser();
    const userAgent = headers['user-agent'];
    const result: HeadersRequest = parser.setUA(userAgent).getResult();

    if (file) {
      const { secure_url } = await this.cloudinaryService.uploadImageUserProfile(file);
      if (secure_url) {
        user = { ...createUserDto, avatar: secure_url };
      }
    }
    return this.authService.create(user, result);

  }


  @Post('test')
  @UseInterceptors(FileInterceptor('image', { fileFilter: fileFilters }))
  async test(
    @UploadedFile() file: Express.Multer.File
  ) {
    const { secure_url } = await this.cloudinaryService.uploadImageUserProfile(file);
    return secure_url;
  }


}
