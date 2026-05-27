import { ApiProperty } from '@nestjs/swagger';
import { Country as CountryType, State as StateType, City as CityType } from '@prisma/client';

export class CountryEntity implements CountryType {
  constructor(partial: Partial<CountryEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  latitude: string;

  @ApiProperty()
  longitude: string;

  @ApiProperty()
  phonecode1: number;
}

export class StateEntity implements StateType {
  constructor(partial: Partial<StateEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  image: string;

  @ApiProperty({ required: false, default: 0 })
  stunning: number | null;

  @ApiProperty({ default: 1 })
  countryId: number;
}

export class CityEntity implements CityType {
  constructor(partial: Partial<CityEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, default: 0 })
  stunning: number | null;

  @ApiProperty()
  image: string;

  @ApiProperty()
  stateId: number;
}

