import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePlanDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  planName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  price: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description1?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description2?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description3?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description4?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description5?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description6?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description7?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description8?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description9?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description10?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description11?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description12?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description13?: string;
}

export class UpdatePlanDto extends PartialType(CreatePlanDto) {}
