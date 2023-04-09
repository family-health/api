import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { ResponseApi } from '../interfaces';
import { isArray } from 'class-validator';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const msg =
            exception instanceof HttpException ? exception.getResponse() : exception;

        this.logger.error(`Status ${status} Error: ${JSON.stringify(msg)}`);
        
        var message: string = '';
        if (isArray(msg.message)) {
            message = msg.message[0];
        } else {
            message = msg.message;
        }

        const res: ResponseApi = {
            success: false,
            message,
            type: msg.error,
            status: msg.statusCode,
            data: null
        }
        response.status(status).json(res);
    }
}