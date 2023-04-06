import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { PaginationDto } from 'src/common/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Family } from './entities';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/auth/entities';

@Injectable()
export class FamilyService {
  private readonly logger = new Logger('UserService');
  constructor(
    @InjectRepository(Family)
    private readonly familyRepository: Repository<Family>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) { }


  async create(createFamilyDto: CreateFamilyDto) {
    const user = await this.userRepository.findOneBy({ id: createFamilyDto.userId });
    if (!user) throw new NotFoundException(`User with id ${createFamilyDto.userId} not found`);
    try {
      const family = this.familyRepository.create({
        ...createFamilyDto,
        user
      });
      await this.familyRepository.save(family);
      return family;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      return this.familyRepository.find({
        take: limit,
        skip: offset,
        relations: {
          user: true
        }
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(id: string) {
    const family = await this.familyRepository.findOneBy({ id });
    if (!family) throw new NotFoundException(`Family with id ${id} not found`);
    return family;
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

      return this.familyRepository.findOneBy({ id });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleExceptions(error);
    }
  }

  remove(id: string) {
    return `This action removes a #${id} family`;
  }


  private handleExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
