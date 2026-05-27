import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsInt, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class ContactOwnerDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  property_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  property_owner: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  country: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  phone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  arrival?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  departure?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value, 10) : 0)
  @IsInt()
  travel?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value, 10) : 0)
  @IsInt()
  adults?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value, 10) : 0)
  @IsInt()
  childs?: number;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  owner_email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;
}
