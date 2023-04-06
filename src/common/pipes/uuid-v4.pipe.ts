import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'uuid';

@Injectable()
export class UuidV4Pipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!validate(value)) {
      throw new BadRequestException('Invalid UUIDv4 format');
    }
    return value;
  }
}