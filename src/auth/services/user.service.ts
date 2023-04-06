import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { UpdateUserDto } from "../dto";

@Injectable()
export class UserService {
    private readonly logger = new Logger('UserService');

    async findAll() { 
        return 'Hola';
    }

    findOne(id: string) { 
        return 'Hola';
    }
  
    update(id: string, updateUserDto: UpdateUserDto) { 
        return 'Hola';
    }
  
    delete(id: string) { 
        return 'Hola';
    }
  
  
    private handleExceptions(error: any) {
      if (error.code === '23505') {
        throw new BadRequestException(error.detail);
      }
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
}