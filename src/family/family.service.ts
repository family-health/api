import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/auth/entities';
import { PaginationDto } from 'src/common/dto';
import { ResponseApi } from 'src/common/interfaces';
import { EmailService } from 'src/email/email.service';
import { DataSource, Repository } from 'typeorm';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { Family } from './entities';
import { isTokenExpired, istokenValid } from './helpers';


@Injectable()
export class FamilyService {
  private readonly logger = new Logger('UserService');
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Family)
    private readonly familyRepository: Repository<Family>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly emailService: EmailService
  ) { }

  async sendInvitationEmail(email: string) {
    const token = this.jwtService.sign({ email: email, timestamp: Date.now() });
    const url_acepted_invitacion = `${process.env.HOST_NAME}/family/accept-invitation/${token}`;
    const subject = 'Invitación para ser miembro de la familia';
    const text = `Hola, has sido invitado a ser miembro de la familia en nuestra aplicación.El token expira en 10 minutos, por favor, haz clic en el siguiente botón para aceptar la invitación:`;
    const html = `<p>Hola, has sido invitado a ser miembro de la familia en nuestra aplicación. Haz clic en el botón para aceptar la invitación:</p>
             <a href=${url_acepted_invitacion} style="background-color: #4CAF50; color: white; border: none; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">
               Aceptar invitación
             </a>`;

    await this.emailService.sendEmail(email, subject, text, html);
  }

  async aceptInvitationEmail(token: string) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as { email: string, timestamp: number };

      if (isTokenExpired(decodedToken.timestamp)) {
        throw new Error('Este token ha expirado');
      }

      if (istokenValid(decodedToken)) {
        throw new BadRequestException('Token no válido');
      }

      // Agregar al usuario como miembro de la familia
      // ...

      const response: ResponseApi = {
        success: true,
        message: 'Invitación aceptada correctamente',
        data: null,
      }
      return response;

    } catch (err) {
      const response: ResponseApi = {
        success: false,
        message: 'El token es invalido',
        data: null,
      }
      return response;
    }
  }

  async create(createFamilyDto: CreateFamilyDto) {
    const user = await this.userRepository.findOneBy({ id: createFamilyDto.userId });
    if (!user) throw new NotFoundException(`User with id ${createFamilyDto.userId} not found`);
    try {
      const family = this.familyRepository.create({
        ...createFamilyDto,
        user
      });
      await this.familyRepository.save(family);
      const response: ResponseApi = {
        success: true,
        message: 'Family created successfully!',
        data: family,
      }
      return response;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const families = await this.familyRepository.find({
        take: limit,
        skip: offset,
        relations: {
          user: true
        }
      });
      const response: ResponseApi = {
        success: true,
        message: 'All Family',
        data: families,
      }
      return response;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByUserId(paginationDto: PaginationDto, userId: string) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const families = await this.familyRepository.find({
        take: limit,
        skip: offset,
        relations: {
          user: false
        },
        where: {
          user: {
            id: userId
          }
        },

      });
      const response: ResponseApi = {
        success: true,
        message: 'All Family By UserId',
        data: families,
      }
      return response;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(id: string) {
    const family = await this.familyRepository.findOneBy({ id });
    if (!family) throw new NotFoundException(`Family with id ${id} not found`);
    const response: ResponseApi = {
      success: true,
      message: 'Family found!',
      data: family,
    }
    return response;
  }

  async update(id: string, updateFamilyDto: UpdateFamilyDto) {
    const { ...toUpdate } = updateFamilyDto;
    const family = await this.familyRepository.preload({
      id,
      ...toUpdate
    });
    if (!family) throw new NotFoundException(`Family with id ${id} not found`);
    // ⁡⁢⁢⁢create query runner⁡
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(family);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      const res = await this.familyRepository.findOneBy({ id });
      const response: ResponseApi = {
        success: true,
        message: 'Family modified successfully!',
        data: res,
      }
      return response;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const family = await this.familyRepository.findOneBy({ id });
    if (!family) throw new NotFoundException(`Family with id ${id} not found`);
    try {
      const res = await this.familyRepository.delete({ id });
      const response: ResponseApi = {
        success: true,
        message: 'Family removed successfully!',
        data: res,
      }
      return response;
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
