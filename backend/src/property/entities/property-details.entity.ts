import { ApiProperty } from '@nestjs/swagger';
import { PropertyDescription as PropertyDescriptionType, PropertyExtra as PropertyExtraType } from '@prisma/client';

export class PropertyDescriptionEntity implements PropertyDescriptionType {
  constructor(partial: Partial<PropertyDescriptionEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  propertyId: number;

  @ApiProperty({ required: false })
  toasterDesc: string | null;

  @ApiProperty({ required: false })
  kitchenDesc: string | null;

  @ApiProperty({ required: false })
  dishwasherDesc: string | null;

  @ApiProperty({ required: false })
  microwaveDesc: string | null;

  @ApiProperty({ required: false })
  coffeeMakeDesc: string | null;

  @ApiProperty({ required: false })
  pantryItemDesc: string | null;

  @ApiProperty({ required: false })
  ovenDesc: string | null;

  @ApiProperty({ required: false })
  stoveDesc: string | null;

  @ApiProperty({ required: false })
  refrigeratorDesc: string | null;

  @ApiProperty({ required: false })
  dishUtenDesc: string | null;

  @ApiProperty({ required: false })
  heatingDesc: string | null;

  @ApiProperty({ required: false })
  fireplaceDesc: string | null;

  @ApiProperty({ required: false })
  internetDesc: string | null;

  @ApiProperty({ required: false })
  livingRoomDesc: string | null;

  @ApiProperty({ required: false })
  towelsProvidedDesc: string | null;

  @ApiProperty({ required: false })
  wInternetDesc: string | null;

  @ApiProperty({ required: false })
  washingMDesc: string | null;

  @ApiProperty({ required: false })
  parkingDesc: string | null;

  @ApiProperty({ required: false })
  linensPDesc: string | null;

  @ApiProperty({ required: false })
  telephoneDesc: string | null;

  @ApiProperty({ required: false })
  fitnessREDesc: string | null;

  @ApiProperty({ required: false })
  acDesc: string | null;

  @ApiProperty({ required: false })
  clothDryerDesc: string | null;

  @ApiProperty({ required: false })
  tvDesc: string | null;

  @ApiProperty({ required: false })
  poolTDesc: string | null;

  @ApiProperty({ required: false })
  gameRDecs: string | null;

  @ApiProperty({ required: false })
  videoLDesc: string | null;

  @ApiProperty({ required: false })
  satelliteCDesc: string | null;

  @ApiProperty({ required: false })
  piPoDesc: string | null;

  @ApiProperty({ required: false })
  spaWDesc: string | null;

  @ApiProperty({ required: false })
  hottubDesc: string | null;

  @ApiProperty({ required: false })
  saunaDesc: string | null;

  @ApiProperty({ required: false })
  commuPoolDesc: string | null;

  @ApiProperty({ required: false })
  balconyDesc: string | null;

  @ApiProperty({ required: false })
  dectPaDesc: string | null;

  @ApiProperty({ required: false })
  lawGDesc: string | null;

  @ApiProperty({ required: false })
  smokeDDesc: string | null;

  @ApiProperty({ required: false })
  cmdLoca: string | null;

  @ApiProperty({ required: false })
  feLocation: string | null;

  @ApiProperty({ required: false })
  fakLocation: string | null;

  @ApiProperty({ required: false })
  eerInst: string | null;

  @ApiProperty({ required: false })
  hcontactDesc: string | null;

  @ApiProperty({ required: false })
  pcontactDesc: string | null;

  @ApiProperty({ required: false })
  fstationDesc: string | null;

  @ApiProperty({ required: false })
  additionalLocaInfo: string | null;

  @ApiProperty({ required: false })
  aboutCreater: string | null;

  @ApiProperty({ required: false })
  yThisPro: string | null;

  @ApiProperty({ required: false })
  uniqueBene: string | null;

  @ApiProperty({ required: false })
  bedDesc: string | null;

  @ApiProperty({ required: false })
  bathDesc: string | null;

  @ApiProperty({ required: false })
  addInfo: string | null;

  @ApiProperty({ required: false })
  youtubeUrl: string | null;
}

export class PropertyExtraEntity implements PropertyExtraType {
  constructor(partial: Partial<PropertyExtraEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  propertyId: number;

  @ApiProperty({ required: false })
  petFee: string | null;

  @ApiProperty({ required: false })
  cleaningFee: string | null;

  @ApiProperty({ required: false })
  taxes: string | null;

  @ApiProperty({ required: false })
  damageProtection: string | null;

  @ApiProperty({ required: false })
  paymentTerms: string | null;
}

