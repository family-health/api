import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { User } from './entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from "bcrypt";


@Injectable()
export class AuthService {
    private readonly logger = new Logger('AuthService');
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
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
            return user;
          } catch (error) {
            this.handleExceptions(error);
          }

    }

    private handleExceptions(error: any) {
        if (error.code === '23505') {
          throw new BadRequestException(error.detail);
        }
        this.logger.error(error);
        throw new InternalServerErrorException('Unexpected error, check server logs');
      }
}
