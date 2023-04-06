import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '../dto';
import { User } from '../entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from "bcrypt";
import { JwtPayload } from '../interfaces';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto) {

    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      }
      );
      await this.userRepository.save(user);
      delete user.password;
      return { ...user, token: this.getJwyToken({ id: user.id }) };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: {
        email
      },
      select: {
        email: true,
        password: true,
        id: true
      }
    });
    if (!user) throw new UnauthorizedException(`Invalid credentials entered`);
    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException(`Invalid credentials entered`);

    try {
      delete user.password;
      return { ...user, token: this.getJwyToken({ id: user.id }) };
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
