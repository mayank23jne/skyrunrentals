import { ApiProperty } from '@nestjs/swagger';
import { 
  Amenity as AmenityType, 
  BeddingInfo as BeddingInfoType, 
  NearbyPlace as NearbyPlaceType, 
  Photo as PhotoType, 
  Rate as RateType,
  PropertyType,
  PropertyView,
  OwnerMessage as OwnerMessageType
} from '@prisma/client';

export class AmenityEntity implements AmenityType {
  constructor(partial: Partial<AmenityEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  propertyId: number;

  @ApiProperty({ required: false })
  childrenSuitability: string | null;

  @ApiProperty({ required: false })
  smokingSuitability: string | null;

  @ApiProperty({ required: false })
  wheelchairSuitability: string | null;

  @ApiProperty({ required: false })
  petsSuitability: string | null;

  @ApiProperty({ required: false })
  otherSuitability: string | null;

  @ApiProperty({ required: false })
  kitchenDining: string | null;

  @ApiProperty({ required: false })
  diningArea: string | null;

  @ApiProperty({ required: false })
  diningSeats: string | null;

  @ApiProperty({ required: false })
  popularAmenities: string | null;

  @ApiProperty({ required: false })
  entertainment: string | null;

  @ApiProperty({ required: false })
  safetyFeatures: string | null;

  @ApiProperty({ required: false })
  settingView: string | null;

  @ApiProperty({ required: false })
  attractions: string | null;

  @ApiProperty({ required: false })
  leisure: string | null;

  @ApiProperty({ required: false })
  sports: string | null;

  @ApiProperty({ required: false })
  poolSpa: string | null;

  @ApiProperty({ required: false })
  outdoorFeatures: string | null;

  @ApiProperty({ required: false })
  accommodationType: string | null;

  @ApiProperty({ required: false })
  meals: string | null;

  @ApiProperty({ required: false })
  breakfast: string | null;

  @ApiProperty({ required: false })
  lunch: string | null;

  @ApiProperty({ required: false })
  dinner: string | null;

  @ApiProperty({ required: false })
  houseKeeping: string | null;

  @ApiProperty({ required: false })
  otherServices: string | null;

  @ApiProperty({ required: false })
  themes: string | null;

  @ApiProperty({ required: false })
  additionalInfo: string | null;

  @ApiProperty({ required: false })
  bicycleQty: number | null;
}

export class BeddingInfoEntity implements BeddingInfoType {
  constructor(partial: Partial<BeddingInfoEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  propertyId: number;

  @ApiProperty({ required: false })
  king: string | null;

  @ApiProperty({ required: false })
  queen: string | null;

  @ApiProperty({ required: false })
  doubleBed: string | null;

  @ApiProperty({ required: false })
  twinSingle: string | null;

  @ApiProperty({ required: false })
  childBed: string | null;

  @ApiProperty({ required: false })
  babyCrib: string | null;

  @ApiProperty({ required: false })
  sleepSofaFuton: string | null;

  @ApiProperty({ required: false })
  note: string | null;
}

export class NearbyPlaceEntity implements NearbyPlaceType {
  constructor(partial: Partial<NearbyPlaceEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  propertyId: number;

  @ApiProperty({ required: false })
  nearestAirport: string | null;

  @ApiProperty({ required: false })
  airportDistance: string | null;

  @ApiProperty({ required: false })
  nearestBeach: string | null;

  @ApiProperty({ required: false })
  beachDistance: string | null;

  @ApiProperty({ required: false })
  nearestFerry: string | null;

  @ApiProperty({ required: false })
  ferryDistance: string | null;

  @ApiProperty({ required: false })
  nearestTrain: string | null;

  @ApiProperty({ required: false })
  trainDistance: string | null;

  @ApiProperty({ required: false })
  nearestHighway: string | null;

  @ApiProperty({ required: false })
  highwayDistance: string | null;

  @ApiProperty({ required: false })
  nearestBar: string | null;

  @ApiProperty({ required: false })
  barDistance: string | null;

  @ApiProperty({ required: false })
  nearestSki: string | null;

  @ApiProperty({ required: false })
  skiDistance: string | null;

  @ApiProperty({ required: false })
  nearestGolf: string | null;

  @ApiProperty({ required: false })
  golfDistance: string | null;

  @ApiProperty({ required: false })
  nearestRestaurant: string | null;

  @ApiProperty({ required: false })
  restaurantDistance: string | null;

  @ApiProperty({ required: false })
  nearMotor: string | null;

  @ApiProperty({ required: false })
  motorDist: string | null;
}

export class PhotoEntity implements PhotoType {
  constructor(partial: Partial<PhotoEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  propertyId: number;

  @ApiProperty({ required: false })
  imageName: string | null;

  @ApiProperty({ required: false, default: 0 })
  defaultImage: number | null;

  @ApiProperty({ default: 0 })
  imageOrder: number;
}

export class RateEntity implements RateType {
  constructor(partial: Partial<RateEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  propertyId: number;

  @ApiProperty({ required: false })
  seasonName: string | null;

  @ApiProperty({ required: false })
  startDate: Date | null;

  @ApiProperty({ required: false })
  endDate: Date | null;

  @ApiProperty({ required: false })
  minimumStay: string | null;

  @ApiProperty({ required: false })
  weekendNight: string | null;

  @ApiProperty({ required: false })
  nightly: number | null;

  @ApiProperty({ required: false })
  weekly: string | null;

  @ApiProperty({ required: false })
  monthly: string | null;
}

export class PropertyTypeEntity implements PropertyType {
  constructor(partial: Partial<PropertyTypeEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  propertyName: string;
}

export class PropertyViewEntity implements PropertyView {
  constructor(partial: Partial<PropertyViewEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class OwnerMessageEntity implements OwnerMessageType {
  constructor(partial: Partial<OwnerMessageEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  propertyId: number;

  @ApiProperty()
  propertyOwner: number;

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  countryId: number;

  @ApiProperty()
  arrival: string;

  @ApiProperty()
  departure: string;

  @ApiProperty()
  adults: number;

  @ApiProperty()
  childs: number;

  @ApiProperty({ required: false })
  travel: number | null;

  @ApiProperty()
  message: string;

  @ApiProperty()
  createdAt: Date;
}


