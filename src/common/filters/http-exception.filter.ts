import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { ResponseApi } from '../interfaces';

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

        const res: ResponseApi = {
            success: false,
            message: msg.message,
            type: msg.error,
            status: msg.statusCode,
            data: null
        }
        response.status(status).json(res);
    }
}