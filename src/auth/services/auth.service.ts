import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from "bcrypt";
import { ResponseApi } from 'src/common/interfaces';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from '../dto';
import { User } from '../entities';
import { JwtPayload } from '../interfaces';
import { HeadersRequest } from './../interfaces';


@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    
  ) { }

  async create(createUserDto: CreateUserDto, headers: HeadersRequest) {

    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      const res = await this.userRepository.findOne({
        where: {
          id: user.id
        },
        select: {
          email: true,
          password: true,
          id: true,
          avatar: true,
          family: true,
          name: true,
          phone: true,
          lastname: true,
          birth: true,
          gender: true,
          height: true,
          weight: true,
          roles: true,
        }
      });
      if (!res) throw new NotFoundException(`User with id ${user} not found`);
      const response: ResponseApi = {
        success: true,
        status: 200,
        message: 'User created successfully!',
        data: {
          ...res, token: this.getJwyToken({ id: res.id })
        },
      }
      return response;
    } catch (error) {
      this.handleExceptions(error);
    }
  }


  async login(loginUserDto: LoginUserDto, headers: HeadersRequest) {

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: {
        email
      },
      select: {
        email: true,
        password: true,
        id: true,
        avatar: true,
        family: true,
        name: true,
        phone: true,
        lastname: true,
        birth: true,
        gender: true,
        height: true,
        weight: true,
        roles: true,
      }
    });
    if (!user) throw new UnauthorizedException(`Invalid credentials entered`);
    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException(`Invalid credentials entered`);

    try {
      const response: ResponseApi = {
        status:200,
        success: true,
        message: 'User authenticated successfully!',
        data: {
          ...user, token: this.getJwyToken({ id: user.id })
        },
      }
      return response;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private getJwyToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
  private handleExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
