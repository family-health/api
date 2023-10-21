import { validarFrecuenciaCardiaca } from './../utils/helper.utils';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateWatchHealthDatumDto } from './dto/create-watch-health-datum.dto';
import { UpdateWatchHealthDatumDto } from './dto/update-watch-health-datum.dto';
import { WatchHealthDatum } from './entities'
import { Between, DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities';
import { ResponseApi } from 'src/common/interfaces';
import { PaginationDto } from 'src/common/dto';
import { TypeHealthData } from 'src/common/enums';
import { IHealthData } from './model';
import { getDatesOfWeekStartingFromMonday, extractYearMonthDay, getDatesFromMondayToToday, calcularEdad } from 'src/utils';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class HealthDataService {
  private readonly logger = new Logger('HealthDataService');

  constructor(
    @InjectRepository(WatchHealthDatum)
    private readonly watchHealthDatumRepository: Repository<WatchHealthDatum>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly emailService: EmailService
  ) { }

  async create(createWatchHealthDatumDto: CreateWatchHealthDatumDto) {
    const user = await this.userRepository.findOneBy({ id: createWatchHealthDatumDto.userId });
    if (!user) throw new NotFoundException(`User with id ${createWatchHealthDatumDto.userId} not found`);
    const fechaNacimiento = new Date(user.birth);
    const edad = calcularEdad(fechaNacimiento);
    const frc = createWatchHealthDatumDto.value;

    const alert = validarFrecuenciaCardiaca(edad,frc);

    if (alert.alert && createWatchHealthDatumDto.type === TypeHealthData.HEART_RATE) {
      this.sendAlertEmail(user.email,alert.frec);
    }


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
          user: false
        }
      });
      const response: ResponseApi = {
        status: 200,
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
        status: 200,
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
      status: 200,
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
        status: 200,
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
        status: 200
      }
      return response;
    } catch (error) {
      this.handleExceptions(error);
    }
  }


  async getPromedioByIdUserAndTypeAllTime(paginationDto: PaginationDto, userId: string, type: string) {

    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const healthDatum = await this.watchHealthDatumRepository.find({
        take: limit,
        skip: offset,
        relations: {
          user: false
        },
        where: {
          user: {
            id: userId
          },
          type
        },

      });

      const data: IHealthData[] = healthDatum;
      // Crea una variable para almacenar el promedio.
      let average = 0;

      // Recorre el arreglo `data`.
      for (const healthDatum of data) {
        // Suma el valor de cada elemento al total.
        average += healthDatum.value;
      }

      // Divide el total por la cantidad de elementos para obtener el promedio.
      average /= data.length;


      switch (type) {

        case TypeHealthData.HEART_RATE:

          const heart_rate: ResponseApi = {
            status: 200,
            success: true,
            message: `Promedio de tipo ${TypeHealthData.HEART_RATE}`,
            data: {
              primedio: average
            },
          }
          return heart_rate;

        case TypeHealthData.BLOOD_GLUCOSE:

          const blood_glucose: ResponseApi = {
            status: 200,
            success: true,
            message: `Promedio de tipo ${TypeHealthData.BLOOD_GLUCOSE}`,
            data: {
              primedio: average
            },
          }
          return blood_glucose;

        case TypeHealthData.STEPS:

          const steps: ResponseApi = {
            status: 200,
            success: true,
            message: `Promedio de tipo ${TypeHealthData.STEPS}`,
            data: {
              primedio: average
            },
          }
          return steps;


        default:
          let response: ResponseApi = {
            status: 403,
            success: false,
            message: 'El tipo es incorrecto',
            data: null,
          }
          return response;
      }

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async getPromedioByIdUserAndTypeByTime(paginationDto: PaginationDto, userId: string, type: string, startDate: Date, endDate: Date) {

    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const query = `
      SELECT *
      FROM watch_health_datum
      WHERE "createdAt" BETWEEN $1 AND $2 AND "userId" = $3 AND "type"= $4`;

      const parameters = [extractYearMonthDay(startDate), extractYearMonthDay(endDate), userId, type];

      const healthDatum = await this.userRepository.query(query, parameters);

      if (healthDatum.length < 1) {
        const data_vacia: ResponseApi = {
          status: 200,
          success: true,
          message: `No hay registros en esas fechas`,
          data: null,
        }
        return data_vacia;
      }

      const data: IHealthData[] = healthDatum;
      let average = 0;

      for (const healthDatum of data) {
        average += healthDatum.value;
      }

      average /= data.length;


      switch (type) {

        case TypeHealthData.HEART_RATE:

          const heart_rate: ResponseApi = {
            status: 200,
            success: true,
            message: `Promedio de tipo ${TypeHealthData.HEART_RATE}`,
            data: {
              primedio: average
            },
          }
          return heart_rate;

        case TypeHealthData.STEPS:

          const steps: ResponseApi = {
            status: 200,
            success: true,
            message: `Promedio de tipo ${TypeHealthData.STEPS}`,
            data: {
              primedio: average
            },
          }
          return steps;
        case TypeHealthData.BLOOD_GLUCOSE:

          const blood_glucose: ResponseApi = {
            status: 200,
            success: true,
            message: `Promedio de tipo ${TypeHealthData.BLOOD_GLUCOSE}`,
            data: {
              primedio: average
            },
          }
          return blood_glucose;


        default:
          let response: ResponseApi = {
            status: 403,
            success: false,
            message: 'El tipo es incorrecto',
            data: null,
          }
          return response;
      }

    } catch (error) {
      this.handleExceptions(error);
    }
  }


  async getPromedioByIdUserForWeek(paginationDto: PaginationDto, userId: string, type: string) {
    const daysWeek = getDatesFromMondayToToday();

    const responsePromises = daysWeek.map(async (day, i) => {
      const query = `
        SELECT *
        FROM watch_health_datum
        WHERE DATE("createdAt") = $1 AND "userId" = $2 AND "type" = $3`;

      const parameters = [day, userId, type];
      const healthDatum = await this.userRepository.query(query, parameters);

      const data: IHealthData[] = healthDatum;

      let average = 0;

      for (const healthDatum of data) {
        average += healthDatum.value;
      }

      average /= data.length;

      const temp = {
        x: i,
        y: isNaN(average) ? 0 : average
      };

      return temp;
    });

    const response = await Promise.all(responsePromises);

    const responseApi: ResponseApi = {
      success: true,
      message: 'Promedio de la semana para grafica',
      status: 200,
      data: response
    }
    return responseApi;
  }

  private async sendAlertEmail(email: string, frec:number) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException(`User with email ${email} not found`);
    const subject = 'Signos vitales';
    const text = ``;
    const html = `
      <p>Alerta tu freciencia cardiaca es de ${frec} lpm </p>
    `;

    try {
      await this.emailService.sendEmail(email, subject, text, html);
      const response: ResponseApi = {
        success: true,
        message: 'Invitación enviada correctamente',
        data: null,
        status: 200
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
