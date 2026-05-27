import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePropertyDto } from './create-property.dto';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
  @ApiProperty({ required: false, description: 'Comma-separated photo IDs to remove' })
  @IsOptional()
  @IsString()
  removedPhotos?: string;

  @ApiProperty({ required: false, description: 'ID of the existing photo to set as default' })
  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value, 10) : null)
  mainPhotoId?: number | null;
}
