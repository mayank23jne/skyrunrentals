import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { User as UserType } from '@prisma/client';

export class UserEntity implements UserType {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  original_password: string | null;

  @ApiProperty()
  contact_number: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  zipcode: number;

  @Exclude()
  token: string;

  @ApiProperty({ default: '1' })
  usertype: string;

  @ApiProperty({ default: 0 })
  status: number;

  @ApiProperty({ default: 0 })
  subscription_type: number;

  @ApiProperty()
  create_date: Date;

  @ApiProperty({ default: 0 })
  deleted: number;

  @Expose()
  get fullName(): string {
    return `${this.firstname} ${this.lastname}`;
  }
}

