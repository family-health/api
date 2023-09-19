import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class DateValidationPipe implements PipeTransform {
  transform(value: any): Date {
    const date = new Date(value);

    if (isNaN(date.getTime())) {
      throw new BadRequestException('La fecha proporcionada no es válida.');
    }

    return date;
  }
}