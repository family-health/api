import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateWatchHealthDatumDto } from './dto/create-watch-health-datum.dto';
import { UpdateWatchHealthDatumDto } from './dto/update-watch-health-datum.dto';
import { WatchHealthDatum } from './entities'
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities';
import { ResponseApi } from 'src/common/interfaces';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class HealthDataService {
  private readonly logger = new Logger('HealthDataService');

  constructor(
    @InjectRepository(WatchHealthDatum)
    private readonly watchHealthDatumRepository: Repository<WatchHealthDatum>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) { }

  async create(createWatchHealthDatumDto: CreateWatchHealthDatumDto) {
    const user = await this.userRepository.findOneBy({ id: createWatchHealthDatumDto.userId });
    if (!user) throw new NotFoundException(`User with id ${createWatchHealthDatumDto.userId} not found`);
    try {
      const watchHealthDatum = this.watchHealthDatumRepository.create({
        ...createWatchHealthDatumDto,
        user
      });
      await this.watchHealthDatumRepository.save(watchHealthDatum);
      const response: ResponseApi = {
        status: 200,
        success: true,
        message: 'watchHealthDatum created successfully!',
        data: watchHealthDatum,
      }
      return response;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const families = await this.watchHealthDatumRepository.find({
        take: limit,
        skip: offset,
        relations: {
          user: true
        }
      });
      const response: ResponseApi = {
        status:200,
        success: true,
        message: 'All watchHealthDatum',
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
      const families = await this.watchHealthDatumRepository.find({
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
        status:200,
        success: true,
        message: 'All WatchHealthDatum By UserId',
        data: families,
      }
      return response;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(id: string) {
    const watchHealthDatum = await this.watchHealthDatumRepository.findOneBy({ id });
    if (!watchHealthDatum) throw new NotFoundException(`watchHealthDatum with id ${id} not found`);
    const response: ResponseApi = {
      status:200,
      success: true,
      message: 'watchHealthDatum found!',
      data: watchHealthDatum,
    }
    return response;
  }

 async update(id: string, updateWatchHealthDatumDto: UpdateWatchHealthDatumDto) {
    const { ...toUpdate } = updateWatchHealthDatumDto;
    const watchHealthDatum = await this.watchHealthDatumRepository.preload({
      id,
      ...toUpdate
    });
    if (!watchHealthDatum) throw new NotFoundException(`watchHealthDatum with id ${id} not found`);
    // ⁡⁢⁢⁢create query runner⁡
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(watchHealthDatum);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      const res = await this.watchHealthDatumRepository.findOneBy({ id });
      const response: ResponseApi = {
        status:200,
        success: true,
        message: 'watchHealthDatum modified successfully!',
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
    const watchHealthDatum = await this.watchHealthDatumRepository.findOneBy({ id });
    if (!watchHealthDatum) throw new NotFoundException(`watchHealthDatum with id ${id} not found`);
    try {
      const res = await this.watchHealthDatumRepository.delete({ id });
      const response: ResponseApi = {
        success: true,
        message: 'watchHealthDatum removed successfully!',
        data: res,
        status:200
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
