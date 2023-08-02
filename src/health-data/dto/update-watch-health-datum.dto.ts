import { PartialType } from '@nestjs/swagger';
import { CreateWatchHealthDatumDto } from './create-watch-health-datum.dto';

export class UpdateWatchHealthDatumDto extends PartialType(CreateWatchHealthDatumDto) {}
