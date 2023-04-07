import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "../dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities";
import { DataSource, Repository } from "typeorm";
import { PaginationDto } from "src/common/dto";
import { ResponseApi } from "src/common/interfaces";

@Injectable()
export class UserService {
    private readonly logger = new Logger('UserService');

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly dataSource: DataSource,
    ) { }

    async findAll(paginationDto: PaginationDto) {
        try {
            const { limit = 10, offset = 0 } = paginationDto;
            const users = await this.userRepository.find({
                take: limit,
                skip: offset,
                relations: {
                    family: true
                }
            });

            const response: ResponseApi = {
                success: true,
                message: 'All users!',
                data: users,
            }
            return response;
        } catch (error) {
            this.handleExceptions(error);
        }
    }

    async findOne(id: string) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        const response: ResponseApi = {
            success: true,
            message: 'User Found!',
            data: user,
        }
        return response;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const { ...toUpdate } = updateUserDto;
        const user = await this.userRepository.preload({
            id,
            ...toUpdate
        });
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        // ⁡⁢⁢⁢create query runner⁡
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {

            //   if (images) {
            //     await queryRunner.manager.delete(ProductImage, { product: { id } });
            //     product.images = images.map(image => this.productImageRepository.create({ url: image }))
            //   }
            await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();
            await queryRunner.release();
            const response: ResponseApi = {
                success: true,
                message: 'User modificated successfully!',
                data: user,
            }
            return response;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            this.handleExceptions(error);
        }
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