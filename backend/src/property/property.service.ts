import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { S3Service } from '../s3/s3.service';
import { extname } from 'path';
import { ListingPropertyDto } from './dto/listing-property.dto';

@Injectable()
export class PropertyService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service
  ) { }

  // async onModuleInit() {
  //   try {
  //     console.log('Running automatic database date cleanup...');
  //     await this.prisma.$executeRawUnsafe(
  //       `UPDATE rates SET start_date = NULL WHERE start_date = '0000-00-00' OR (start_date IS NOT NULL AND (MONTH(start_date) = 0 OR DAY(start_date) = 0))`
  //     );
  //     await this.prisma.$executeRawUnsafe(
  //       `UPDATE rates SET end_date = NULL WHERE end_date = '0000-00-00' OR (end_date IS NOT NULL AND (MONTH(end_date) = 0 OR DAY(end_date) = 0))`
  //     );
  //     console.log('Database date cleanup completed successfully.');
  //   } catch (error) {
  //     console.error('Error running automatic database date cleanup:', error);
  //   }
  // }



  private async ensureBookingStates() {
    const states = [
      { code: 'AVAIL', descEn: 'Available', class: 'status-available' },
      { code: 'BOOKED', descEn: 'Booked', class: 'status-booked' },
      { code: 'BKDAM', descEn: 'Booked am', class: 'status-booked-am' },
      { code: 'BKDPM', descEn: 'Booked pm', class: 'status-booked-pm' },
    ];

    for (const s of states) {
      const existing = await this.prisma.bookingState.findFirst({ where: { code: s.code } });
      if (!existing) {
        await this.prisma.bookingState.create({ data: { ...s, state: 1, showInKey: 1 } });
      }
    }
  }

  async findMany(options: { skip?: number; take?: number; search?: string; countryId?: number; stateId?: number; cityId?: number; ownerId?: number }) {
    const { skip, take, search, countryId, stateId, cityId, ownerId } = options;
    const where: any = {};

    if (ownerId !== undefined) {
      where.createdBy = ownerId;
    }

    // Geographic filters
    if (cityId) {
      where.city = String(cityId);
    } else if (stateId) {
      where.state = String(stateId);
    } else if (countryId) {
      where.country = String(countryId);
    }

    if (search) {
      where.OR = [
        { propertyHeadline: { contains: search } },
        { city: { contains: search } },
        { state: { contains: search } },
        { propertyType: { contains: search } }
      ];
    }

    const properties = await this.prisma.property.findMany({
      where,
      skip,
      take,
      include: {
        photos: {
          take: 5,
          orderBy: [
            { defaultImage: 'desc' },
            { imageOrder: 'asc' }
          ]
        },
        rates: {
          take: 1,
          orderBy: { nightly: 'asc' }
        }
      },
      orderBy: { id: 'desc' },
    });

    return properties.map(p => ({
      ...p,
      photos: p.photos.map(photo => ({
        ...photo,
        imageName: process.env.IMG_PATH + 'uploads/property/' + photo.imageName
      }))
    }));
  }

  async count(options: { search?: string; countryId?: number; stateId?: number; cityId?: number; ownerId?: number } = {}) {
    const { search, countryId, stateId, cityId, ownerId } = options;
    const where: any = {};

    if (ownerId !== undefined) {
      where.createdBy = ownerId;
    }

    if (cityId) {
      where.city = String(cityId);
    } else if (stateId) {
      where.state = String(stateId);
    } else if (countryId) {
      where.country = String(countryId);
    }

    if (search) {
      where.OR = [
        { propertyHeadline: { contains: search } },
        { city: { contains: search } },
        { state: { contains: search } },
        { propertyType: { contains: search } }
      ];
    }
    return this.prisma.property.count({ where });
  }

  async toggleRecommendation(id: number) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) throw new BadRequestException('Property not found');

    return this.prisma.property.update({
      where: { id },
      data: { recommended: property.recommended === 1 ? 0 : 1 }
    });
  }

  async create(body: any, files: Express.Multer.File[], adminId: number) {
    return this.prisma.$transaction(async (tx) => {
      let propCountryName = body.country ? String(body.country) : undefined;
      let propStateName = body.state ? String(body.state) : undefined;
      let propCityName = body.city ? String(body.city) : undefined;

      // 1. Create Property
      const property = await tx.property.create({
        data: {
          propertyHeadline: body.propertyHeadline,
          country: propCountryName,
          state: propStateName,
          city: propCityName,
          streetAddress: body.streetAddress,
          zip: body.zip,
          propertyDescription: body.propertyDescription,
          bedroom: body.bedroom,
          bathroom: body.bathroom,
          propertyType: body.propertyType,
          propertyViewId: body.propertyViewId ? parseInt(body.propertyViewId) : null,
          sleeps: body.sleeps,
          assignTo: body.assignTo ? parseInt(body.assignTo) : null,
          createdBy: adminId,
          yearPurchased: body.yearPurchased || null,
        }
      });

      let contactCountryName = body.contactCountry ? String(body.contactCountry) : undefined;
      let contactStateName = body.contactState ? String(body.contactState) : undefined;
      let contactCityName = body.contactCity ? String(body.contactCity) : undefined;

      // 2. Create Contact
      await tx.contact.create({
        data: {
          propertyId: property.id,
          name: body.contactName,
          country: contactCountryName,
          state: contactStateName,
          city: contactCityName,
          streetAddress: body.contactStreetAddress,
          zip: body.contactZip,
          email: body.contactEmail,
          regEmail: body.contactReEmail,
          mobileNumber: body.contactMobile,
          callingHours: body.contactCallingHours,
          altEmail: body.contactAltEmail,
          smsNumber: body.contactMobile || '', // mapping mobile to sms if available
          othLanguage: '', // placeholder
        }
      });

      // 3. Create Amenities
      await tx.amenity.create({
        data: {
          propertyId: property.id,
          childrenSuitability: body.childrenSuitability,
          smokingSuitability: body.smokingSuitability,
          wheelchairSuitability: body.wheelchairSuitability,
          petsSuitability: body.petsSuitability,
          otherSuitability: Array.isArray(body.otherSuitability) ? body.otherSuitability.join(', ') : body.otherSuitability,
          kitchenDining: Array.isArray(body.kitchenDining) ? body.kitchenDining.join(', ') : body.kitchenDining,
          diningArea: body.diningArea,
          diningSeats: body.diningSeats,
          popularAmenities: Array.isArray(body.popularAmenities) ? body.popularAmenities.join(', ') : body.popularAmenities,
          entertainment: Array.isArray(body.entertainment) ? body.entertainment.join(', ') : body.entertainment,
          poolSpa: Array.isArray(body.poolSpa) ? body.poolSpa.join(', ') : body.poolSpa,
          outdoorFeatures: Array.isArray(body.outdoorFeatures) ? body.outdoorFeatures.join(', ') : body.outdoorFeatures,
          otherServices: Array.isArray(body.otherServices) ? body.otherServices.join(', ') : body.otherServices,
          themes: Array.isArray(body.themes) ? body.themes.join(', ') : body.themes,
          additionalInfo: body.additionalInfo,
        }
      });

      // 3.5 Create Dynamic Amenities
      const dynamicAmenities = Array.isArray(body.dynamicAmenities) ? body.dynamicAmenities : (body.dynamicAmenities ? [body.dynamicAmenities] : []);
      if (dynamicAmenities.length > 0) {
        await tx.propertyAmenity.createMany({
          data: dynamicAmenities.map(amenityItemId => ({
            propertyId: property.id,
            amenityItemId: parseInt(amenityItemId),
          }))
        });
      }

      // 4. Create Bedding Info
      await tx.beddingInfo.create({
        data: {
          propertyId: property.id,
          king: body.king,
          queen: body.queen,
          doubleBed: body.doubleBed,
          twinSingle: body.twinSingle,
          childBed: body.childBed,
          babyCrib: body.babyCrib,
          sleepSofaFuton: body.sleepSofaFuton,
          note: body.beddingNote,
        }
      });

      // 5. Create Nearby Places
      await tx.nearbyPlace.create({
        data: {
          propertyId: property.id,
          nearestAirport: body.nearestAirport,
          airportDistance: body.airportDistance ? `${body.airportDistance} ${body.nearestAirportUnit}` : null,
          nearestBeach: body.nearestBeach,
          beachDistance: body.beachDistance ? `${body.beachDistance} ${body.nearestBeachUnit}` : null,
          nearestFerry: body.nearestFerry,
          ferryDistance: body.ferryDistance ? `${body.ferryDistance} ${body.nearestFerryUnit}` : null,
          nearestTrain: body.nearestTrain,
          trainDistance: body.trainDistance ? `${body.trainDistance} ${body.nearestTrainUnit}` : null,
          nearestHighway: body.nearestHighway,
          highwayDistance: body.highwayDistance ? `${body.highwayDistance} ${body.nearestHighwayUnit}` : null,
          nearestBar: body.nearestBar,
          barDistance: body.barDistance ? `${body.barDistance} ${body.nearestBarUnit}` : null,
          nearestSki: body.nearestSki,
          skiDistance: body.skiDistance ? `${body.skiDistance} ${body.nearestSkiUnit}` : null,
          nearestGolf: body.nearestGolf,
          golfDistance: body.golfDistance ? `${body.golfDistance} ${body.nearestGolfUnit}` : null,
          nearestRestaurant: body.nearestRestaurant,
          restaurantDistance: body.restaurantDistance ? `${body.restaurantDistance} ${body.nearestRestaurantUnit}` : null,
        }
      });

      // 6. Create Rates
      if (body.seasonalRates) {
        const rates = JSON.parse(body.seasonalRates);
        for (const rate of rates) {
          await tx.rate.create({
            data: {
              propertyId: property.id,
              seasonName: rate.seasonName,
              startDate: rate.startDate ? new Date(rate.startDate) : null,
              endDate: rate.endDate ? new Date(rate.endDate) : null,
              minimumStay: rate.minStay,
              weekendNight: rate.weekendNight ? rate.weekendNight.toString() : null,
              nightly: rate.nightly ? parseFloat(rate.nightly) : null,
              weekly: rate.weekly ? rate.weekly.toString() : null,
              monthly: rate.monthly ? rate.monthly.toString() : null,
            }
          });
        }
      }

      // 7. Create Property Extras
      await tx.propertyExtra.create({
        data: {
          propertyId: property.id,
          petFee: body.petFee,
          cleaningFee: body.cleaningFee,
          taxes: body.taxes,
          damageProtection: body.damageProtection,
          paymentTerms: body.paymentTerms,
        }
      });

      // 8. Create Photos (S3 Integration)
      const mainPhotoIndex = body.mainPhotoIndex ? parseInt(body.mainPhotoIndex) : 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Process and Upload to S3 (Original + Thumbnail)
        const s3Url = await this.processAndUploadPhoto(file);

        await tx.photo.create({
          data: {
            propertyId: property.id,
            imageName: s3Url,
            defaultImage: i === mainPhotoIndex ? 1 : 0,
            imageOrder: i,
          }
        });
      }

      // 9. Handle Calendar Availability
      if (body.calendarBlockedDates) {
        await this.ensureBookingStates();
        const blockedDates = JSON.parse(body.calendarBlockedDates);
        const states = await this.prisma.bookingState.findMany();
        const stateCodeToId = {};
        states.forEach(s => {
          if (s.code === 'BOOKED') stateCodeToId['booked'] = s.id;
          if (s.code === 'BKDAM') stateCodeToId['am'] = s.id;
          if (s.code === 'BKDPM') stateCodeToId['pm'] = s.id;
        });

        let bookingItem = await tx.bookingItem.findFirst({ where: { idRefExternal: property.id } });
        if (!bookingItem) {
          bookingItem = await tx.bookingItem.create({
            data: {
              idRefExternal: property.id,
              descEn: `Property_id ${property.id}`,
              idUser: 1
            }
          });
        }

        // Delete existing bookings for this item to overwrite
        await tx.booking.deleteMany({ where: { idItem: bookingItem.id } });

        // Add new bookings
        for (const [dateStr, status] of Object.entries(blockedDates)) {
          const stateId = stateCodeToId[status as string];
          if (stateId) {
            await tx.booking.create({
              data: {
                idItem: bookingItem.id,
                theDate: new Date(dateStr),
                idState: stateId,
                idBooking: 0
              }
            });
          }
        }
      }

      return property;
    }, { maxWait: 5000, timeout: 30000 });
  }

  async findOne(id: number) {
    let property;
    try {
      property = await this.prisma.property.findUnique({
        where: { id },
        include: {
            contacts: true,
            amenities: true,
            propertyAmenities: { include: { amenityItem: { include: { category: true } } } },
          beddingInfo: true,
          nearbyPlaces: true,
          rates: true,
          propertyExtras: true,
          photos: {
            orderBy: { imageOrder: 'asc' }
          }
        }
      });
    } catch (e) {
      console.error('Error fetching property (possibly missing propertyAmenities table):', e);
      // Fallback for unmigrated server database
      property = await this.prisma.property.findUnique({
        where: { id },
        include: {
            contacts: true,
            amenities: true,
          beddingInfo: true,
          nearbyPlaces: true,
          rates: true,
          propertyExtras: true,
          photos: {
            orderBy: { imageOrder: 'asc' }
          }
        }
      });
      if (property) {
        (property as any).propertyAmenities = [];
      }
    }

    if (property) {
      // Fetch calendar data
      const bookingItem = await this.prisma.bookingItem.findFirst({
        where: { idRefExternal: id }
      });

      if (bookingItem) {
        const bookings = await this.prisma.booking.findMany({
          where: { idItem: bookingItem.id }
        });

        const states = await this.prisma.bookingState.findMany();
        const stateIdToCode: Record<number, string> = {};
        states.forEach(s => {
          if (s.code === 'BOOKED') stateIdToCode[s.id] = 'booked';
          if (s.code === 'BKDAM') stateIdToCode[s.id] = 'am';
          if (s.code === 'BKDPM') stateIdToCode[s.id] = 'pm';
        });

        const calendarBlockedDates: Record<string, string> = {};
        bookings.forEach(b => {
          if (b.theDate && !isNaN(b.theDate.getTime())) {
            const dateStr = b.theDate.toISOString().split('T')[0];
            const status = stateIdToCode[b.idState];
            if (status) calendarBlockedDates[dateStr] = status;
          }
        });
        (property as any).calendarBlockedDates = calendarBlockedDates;
      }
      if (property.photos) {
        property.photos.forEach(photo => {
          photo.imageName = process.env.IMG_PATH + 'uploads/property/' + photo.imageName;
        });
      }
    }

    return property;
  }

  async update(id: number, body: any, files: Express.Multer.File[], adminId: number) {
    return this.prisma.$transaction(async (tx) => {
      let propCountryName = body.country ? String(body.country) : undefined;
      let propStateName = body.state ? String(body.state) : undefined;
      let propCityName = body.city ? String(body.city) : undefined;

      // 1. Update Property
      const property = await tx.property.update({
        where: { id },
        data: {
          propertyHeadline: body.propertyHeadline,
          country: propCountryName,
          state: propStateName,
          city: propCityName,
          streetAddress: body.streetAddress,
          zip: body.zip,
          propertyDescription: body.propertyDescription,
          bedroom: body.bedroom,
          bathroom: body.bathroom,
          propertyType: body.propertyType,
          propertyViewId: body.propertyViewId ? parseInt(body.propertyViewId) : null,
          sleeps: body.sleeps,
          assignTo: body.assignTo ? parseInt(body.assignTo) : null,
          yearPurchased: body.yearPurchased || null,
        }
      });

      let contactCountryName = body.contactCountry ? String(body.contactCountry) : undefined;
      let contactStateName = body.contactState ? String(body.contactState) : undefined;
      let contactCityName = body.contactCity ? String(body.contactCity) : undefined;

      // 2. Update Contact (Delete and Recreate for simplicity)
      await tx.contact.deleteMany({ where: { propertyId: id } });
      await tx.contact.create({
        data: {
          propertyId: id,
          name: body.contactName,
          country: contactCountryName,
          state: contactStateName,
          city: contactCityName,
          streetAddress: body.contactStreetAddress,
          zip: body.contactZip,
          email: body.contactEmail,
          regEmail: body.contactReEmail,
          mobileNumber: body.contactMobile,
          callingHours: body.contactCallingHours,
          altEmail: body.contactAltEmail,
          smsNumber: body.contactMobile || '',
          othLanguage: '',
        }
      });

      // 3. Update Amenities
      await tx.amenity.deleteMany({ where: { propertyId: id } });
      await tx.amenity.create({
        data: {
          propertyId: id,
          childrenSuitability: body.childrenSuitability,
          smokingSuitability: body.smokingSuitability,
          wheelchairSuitability: body.wheelchairSuitability,
          petsSuitability: body.petsSuitability,
          otherSuitability: Array.isArray(body.otherSuitability) ? body.otherSuitability.join(', ') : (body.otherSuitability || ''),
          kitchenDining: Array.isArray(body.kitchenDining) ? body.kitchenDining.join(', ') : (body.kitchenDining || ''),
          diningArea: body.diningArea,
          diningSeats: body.diningSeats,
          popularAmenities: Array.isArray(body.popularAmenities) ? body.popularAmenities.join(', ') : (body.popularAmenities || ''),
          entertainment: Array.isArray(body.entertainment) ? body.entertainment.join(', ') : (body.entertainment || ''),
          poolSpa: Array.isArray(body.poolSpa) ? body.poolSpa.join(', ') : (body.poolSpa || ''),
          outdoorFeatures: Array.isArray(body.outdoorFeatures) ? body.outdoorFeatures.join(', ') : (body.outdoorFeatures || ''),
          otherServices: Array.isArray(body.otherServices) ? body.otherServices.join(', ') : (body.otherServices || ''),
          themes: Array.isArray(body.themes) ? body.themes.join(', ') : (body.themes || ''),
          additionalInfo: body.additionalInfo,
        }
      });

      // 3.5 Update Dynamic Amenities
      await tx.propertyAmenity.deleteMany({ where: { propertyId: id } });
      const dynamicAmenities = Array.isArray(body.dynamicAmenities) ? body.dynamicAmenities : (body.dynamicAmenities ? [body.dynamicAmenities] : []);
      if (dynamicAmenities.length > 0) {
        await tx.propertyAmenity.createMany({
          data: dynamicAmenities.map(amenityItemId => ({
            propertyId: id,
            amenityItemId: parseInt(amenityItemId),
          }))
        });
      }

      // 4. Update Bedding Info
      await tx.beddingInfo.deleteMany({ where: { propertyId: id } });
      await tx.beddingInfo.create({
        data: {
          propertyId: id,
          king: body.king,
          queen: body.queen,
          doubleBed: body.doubleBed,
          twinSingle: body.twinSingle,
          childBed: body.childBed,
          babyCrib: body.babyCrib,
          sleepSofaFuton: body.sleepSofaFuton,
          note: body.beddingNote,
        }
      });

      // 5. Update Nearby Places
      await tx.nearbyPlace.deleteMany({ where: { propertyId: id } });
      await tx.nearbyPlace.create({
        data: {
          propertyId: id,
          nearestAirport: body.nearestAirport,
          airportDistance: body.airportDistance ? `${body.airportDistance} ${body.nearestAirportUnit}` : null,
          nearestBeach: body.nearestBeach,
          beachDistance: body.beachDistance ? `${body.beachDistance} ${body.nearestBeachUnit}` : null,
          nearestFerry: body.nearestFerry,
          ferryDistance: body.ferryDistance ? `${body.ferryDistance} ${body.nearestFerryUnit}` : null,
          nearestTrain: body.nearestTrain,
          trainDistance: body.trainDistance ? `${body.trainDistance} ${body.nearestTrainUnit}` : null,
          nearestHighway: body.nearestHighway,
          highwayDistance: body.highwayDistance ? `${body.highwayDistance} ${body.nearestHighwayUnit}` : null,
          nearestBar: body.nearestBar,
          barDistance: body.barDistance ? `${body.barDistance} ${body.nearestBarUnit}` : null,
          nearestSki: body.nearestSki,
          skiDistance: body.skiDistance ? `${body.skiDistance} ${body.nearestSkiUnit}` : null,
          nearestGolf: body.nearestGolf,
          golfDistance: body.golfDistance ? `${body.golfDistance} ${body.nearestGolfUnit}` : null,
          nearestRestaurant: body.nearestRestaurant,
          restaurantDistance: body.restaurantDistance ? `${body.restaurantDistance} ${body.nearestRestaurantUnit}` : null,
        }
      });

      // 6. Update Rates
      await tx.rate.deleteMany({ where: { propertyId: id } });
      if (body.seasonalRates) {
        const rates = JSON.parse(body.seasonalRates);
        for (const rate of rates) {
          await tx.rate.create({
            data: {
              propertyId: id,
              seasonName: rate.seasonName,
              startDate: rate.startDate ? new Date(rate.startDate) : null,
              endDate: rate.endDate ? new Date(rate.endDate) : null,
              minimumStay: rate.minStay,
              weekendNight: rate.weekendNight ? rate.weekendNight.toString() : null,
              nightly: rate.nightly ? parseFloat(rate.nightly) : null,
              weekly: rate.weekly ? rate.weekly.toString() : null,
              monthly: rate.monthly ? rate.monthly.toString() : null,
            }
          });
        }
      }

      // 7. Update Property Extras
      await tx.propertyExtra.deleteMany({ where: { propertyId: id } });
      await tx.propertyExtra.create({
        data: {
          propertyId: id,
          petFee: body.petFee,
          cleaningFee: body.cleaningFee,
          taxes: body.taxes,
          damageProtection: body.damageProtection,
          paymentTerms: body.paymentTerms,
        }
      });

      // 8. Handle Photos
      // Remove photos marked for deletion
      if (body.removedPhotos) {
        const removedPhotos = body.removedPhotos.split(',');
        await tx.photo.deleteMany({
          where: {
            propertyId: id,
            id: { in: removedPhotos.map(pid => parseInt(pid)) }
          }
        });
      }

      // Update remaining photos order and default status
      const existingPhotos = await tx.photo.findMany({ where: { propertyId: id }, orderBy: { imageOrder: 'asc' } });
      const mainPhotoId = body.mainPhotoId ? parseInt(body.mainPhotoId) : null;

      for (const photo of existingPhotos) {
        await tx.photo.update({
          where: { id: photo.id },
          data: {
            defaultImage: photo.id === mainPhotoId ? 1 : 0
          }
        });
      }

      // Add new photos (S3 Integration)
      let maxOrder = existingPhotos.length > 0 
        ? Math.max(...existingPhotos.map(p => typeof p.imageOrder === 'number' && !isNaN(p.imageOrder) ? p.imageOrder : 0))
        : -1;
      if (isNaN(maxOrder) || !isFinite(maxOrder)) maxOrder = -1;
      let nextOrder = maxOrder + 1;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Process and Upload to S3 (Original + Thumbnail)
        const s3Url = await this.processAndUploadPhoto(file);

        await tx.photo.create({
          data: {
            propertyId: Number(id),
            imageName: s3Url,
            defaultImage: (existingPhotos.length === 0 && i === 0) || (mainPhotoId === null && i === 0) ? 1 : 0,
            imageOrder: isNaN(nextOrder) || !isFinite(nextOrder) ? 0 : nextOrder++,
          }
        });
      }

      // 9. Handle Calendar Availability
      if (body.calendarBlockedDates) {
        await this.ensureBookingStates();
        const blockedDates = JSON.parse(body.calendarBlockedDates);
        const states = await this.prisma.bookingState.findMany();
        const stateCodeToId = {};
        states.forEach(s => {
          if (s.code === 'BOOKED') stateCodeToId['booked'] = s.id;
          if (s.code === 'BKDAM') stateCodeToId['am'] = s.id;
          if (s.code === 'BKDPM') stateCodeToId['pm'] = s.id;
        });

        let bookingItem = await tx.bookingItem.findFirst({ where: { idRefExternal: id } });
        if (!bookingItem) {
          bookingItem = await tx.bookingItem.create({
            data: {
              idRefExternal: id,
              descEn: `Property_id ${id}`,
              idUser: 1
            }
          });
        }

        // Delete existing bookings for this item to overwrite
        await tx.booking.deleteMany({ where: { idItem: bookingItem.id } });

        // Add new bookings
        for (const [dateStr, status] of Object.entries(blockedDates)) {
          const stateId = stateCodeToId[status as string];
          if (stateId) {
            await tx.booking.create({
              data: {
                idItem: bookingItem.id,
                theDate: new Date(dateStr),
                idState: stateId,
                idBooking: 0
              }
            });
          }
        }
      }

      return property;
    }, { maxWait: 5000, timeout: 30000 });
  }

  async delete(id: number) {
    return this.prisma.$transaction(async (tx) => {
      // Manual cascading delete
      await tx.amenity.deleteMany({ where: { propertyId: id } });
      await tx.beddingInfo.deleteMany({ where: { propertyId: id } });
      await tx.contact.deleteMany({ where: { propertyId: id } });
      await tx.nearbyPlace.deleteMany({ where: { propertyId: id } });
      await tx.ownerMessage.deleteMany({ where: { propertyId: id } });
      await tx.photo.deleteMany({ where: { propertyId: id } });
      await tx.propertyBooking.deleteMany({ where: { propertyId: id } });
      await tx.propertyDescription.deleteMany({ where: { propertyId: id } });
      await tx.propertyExtra.deleteMany({ where: { propertyId: id } });
      await tx.rate.deleteMany({ where: { propertyId: id } });

      return tx.property.delete({ where: { id } });
    });
  }

  async createOwnerMessage(id: number, data: any) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      select: { createdBy: true }
    });
    
    // Find country ID if passed as name
    let countryId = 1; // Default
    if (data.country) {
      const country = await this.prisma.country.findFirst({
        where: { name: data.country }
      });
      if (country) countryId = country.id;
    }

    return this.prisma.ownerMessage.create({
      data: {
        propertyId: id,
        propertyOwner: property?.createdBy || 0,
        firstname: data.firstName || '',
        lastname: data.lastName || '',
        phone: data.phone || '',
        email: data.email || '',
        countryId: countryId,
        arrival: data.arrival || '',
        departure: data.departure || '',
        adults: typeof data.adults === 'number' ? data.adults : parseInt(data.adults || '0'),
        childs: typeof data.children === 'number' ? data.children : parseInt(data.children || '0'),
        message: data.message || '',
      }
    });
  }

  async updatePriority(id: number, priority: number) {
    return this.prisma.property.update({
      where: { id },
      data: {
        priority,
        priorityDate: new Date()
      }
    });
  }

  private async processAndUploadPhoto(file: Express.Multer.File): Promise<string> {
    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    const extension = extname(file.originalname);
    const filename = `${randomName}${extension}`;

    // 1. Upload Original to S3
    const originalUrl = await this.s3Service.uploadBuffer(
      file.buffer,
      file.mimetype,
      `images/uploads/property/${filename}`,
      filename
    );

    try {
      // 2. Create and Upload Thumbnail to S3
      const thumbnailBuffer = await sharp(file.buffer)
        .resize(200, 160)
        .toBuffer();

      await this.s3Service.uploadBuffer(
        thumbnailBuffer,
        file.mimetype,
        `images/uploads/property/thumbnail/${filename}`,
        filename
      );
    } catch (error) {
      console.error('S3 Thumbnail Generation/Upload Error:', error);
    }

    return originalUrl;
  }

  async getPropertyDetails(id: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let property;
    try {
      property = await this.prisma.property.findUnique({
        where: { id },
        include: {
            contacts: true,
            amenities: true,
            propertyAmenities: { include: { amenityItem: { include: { category: true } } } },
          beddingInfo: true,
          nearbyPlaces: true,
          rates: true,
          propertyExtras: true,
          photos: true,
        },
      });
    } catch (e) {
      console.error('Error fetching property details (possibly missing propertyAmenities table):', e);
      // Fallback for unmigrated server database
      property = await this.prisma.property.findUnique({
        where: { id },
        include: {
            contacts: true,
            amenities: true,
          beddingInfo: true,
          nearbyPlaces: true,
          rates: true,
          propertyExtras: true,
          photos: true,
        },
      });
      if (property) {
        (property as any).propertyAmenities = [];
      }
    }

    if (!property) return null;

    const [countries, allCurrencies, userDetail, creatorDetail] = await Promise.all([
      this.prisma.country.findMany({ orderBy: { name: 'asc' } }),
      this.prisma.currency.findMany({ orderBy: { name: 'asc' } }),
      property.assignTo ? this.prisma.user.findUnique({ where: { id: property.assignTo } }) : null,
      property.createdBy ? this.prisma.user.findUnique({ where: { id: property.createdBy } }) : null,
    ]);

    // Fetch location objects
    const countryId = parseInt(property.country || '');
    const country = property.country ? await this.prisma.country.findFirst({ where: !isNaN(countryId) ? { id: countryId } : { name: property.country } }) : null;

    const stateId = parseInt(property.state || '');
    const state = property.state ? await this.prisma.state.findFirst({ where: !isNaN(stateId) ? { id: stateId } : { name: property.state } }) : null;

    const cityId = parseInt(property.city || '');
    const city = property.city ? await this.prisma.city.findFirst({ where: !isNaN(cityId) ? { id: cityId } : { name: property.city } }) : null;

    const propertyTypeId = parseInt(property.propertyType || '');
    const propertyTypeObj = property.propertyType ? await this.prisma.propertyType.findFirst({ where: !isNaN(propertyTypeId) ? { id: propertyTypeId } : { propertyName: property.propertyType } }) : null;

    // Fetch bookings (id_item in bookings table corresponds to BookingItem.id)
    const bookingItem = await this.prisma.bookingItem.findFirst({
      where: { idRefExternal: id }
    });

    let bookings: any[] = [];
    if (bookingItem) {
      bookings = await this.prisma.booking.findMany({
        where: {
          idItem: bookingItem.id,
          theDate: { gte: today }
        },
        orderBy: { theDate: 'asc' }
      });
    }

    const defaultPhoto = property.photos.find(p => p.defaultImage === 1);
    const otherPhotos = property.photos.filter(p => p.defaultImage !== 1);

    if (defaultPhoto && defaultPhoto.imageName) {
      defaultPhoto.imageName = process.env.IMG_PATH + 'uploads/property/' + defaultPhoto.imageName;
    }
    otherPhotos.forEach(p => {
      if (p.imageName) p.imageName = process.env.IMG_PATH + 'uploads/property/' + p.imageName;
    });

    return {
      property,
      default_image: defaultPhoto,
      image: otherPhotos,
      bookings,
      amenities: property.amenities[0] || null, // PHP seems to expect a single row for amenities?
      rates: property.rates,
      property_extras: property.propertyExtras[0] || null,
      nearby_places: property.nearbyPlaces[0] || null,
      bedding_info: property.beddingInfo,
      country,
      state,
      city,
      property_type: propertyTypeObj,
      countries,
      currency: allCurrencies,
      contact_detail: property.contacts[0] || null,
      user_detail: userDetail,
      creator_detail: creatorDetail,
    };
  }

  async getFilterProperties(body: any) {
    const page = parseInt(body.page, 10) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where: any = {};

    let isCountrySearch = false;
    if (body.venue_type === 'countries') {
      isCountrySearch = true;
    } else if (body.venue) {
      const exactCountry = await this.prisma.country.findFirst({ where: { name: body.venue.trim() } });
      if (exactCountry) isCountrySearch = true;
    }

    if (!isCountrySearch && body.guests) {
      where.sleeps = { gte: String(parseInt(body.guests, 10) || 0) };
    }

    if (body.property_type_Array && Array.isArray(body.property_type_Array) && body.property_type_Array.length > 0) {
      where.propertyType = { in: body.property_type_Array.map(String) };
    }

    if (body.bed_type_Array && Array.isArray(body.bed_type_Array) && body.bed_type_Array.length > 0) {
      const bedStrings = body.bed_type_Array.flatMap((val: any) => [String(val), `${val} `, ` ${val}`, ` ${val} `]);
      where.bedroom = { in: bedStrings };
    }

    if (body.sleep_type_Array && Array.isArray(body.sleep_type_Array) && body.sleep_type_Array.length > 0) {
      const sleepStrings = body.sleep_type_Array.flatMap((val: any) => [String(val), `${val} `, ` ${val}`, ` ${val} `]);
      where.sleeps = { in: sleepStrings };
    }

    if (body.view_type_Array && Array.isArray(body.view_type_Array) && body.view_type_Array.length > 0) {
      where.propertyViewId = { in: body.view_type_Array.map(Number) };
    }

    if (body.venue) {
      const venueStr = body.venue.trim();
      const propertyId = parseInt(venueStr, 10);

      if (!isNaN(propertyId) && venueStr === String(propertyId)) {
        where.id = propertyId;
      } else {
        where.OR = [
          { propertyHeadline: { contains: venueStr } },
          { city: { contains: venueStr } },
          { state: { contains: venueStr } },
          { country: { contains: venueStr } },
        ];

        const exactCountry = await this.prisma.country.findFirst({ where: { name: venueStr } });
        if (exactCountry) where.OR.push({ country: String(exactCountry.id) });

        const exactState = await this.prisma.state.findFirst({ where: { name: venueStr } });
        if (exactState) where.OR.push({ state: String(exactState.id) });

        const exactCity = await this.prisma.city.findFirst({ where: { name: venueStr } });
        if (exactCity) where.OR.push({ city: String(exactCity.id) });
      }
    }

    let cityIds: string[] = [];
    if (body.city_arr && Array.isArray(body.city_arr) && body.city_arr.length > 0) {
      const citiesFromDb = await this.prisma.city.findMany({
        where: { name: { in: body.city_arr } },
        select: { id: true }
      });
      const idsFromName = citiesFromDb.map((c: any) => String(c.id));
      cityIds = [...body.city_arr].map(String).concat(idsFromName);
    }
    if (body.venue_type === 'cities' && body.venue_id) {
      cityIds.push(String(body.venue_id));
    }

    if (cityIds.length > 0) {
      where.city = { in: cityIds };
    }

    if (body.venue_type === 'countries' && body.venue_id) {
      const country = await this.prisma.country.findUnique({ where: { id: body.venue_id } });
      if (country) where.country = String(body.venue_id);
    } else if (body.venue_type === 'states' && body.venue_id) {
      const state = await this.prisma.state.findUnique({ where: { id: body.venue_id } });
      if (state) where.state = String(body.venue_id);
    }

    const amtFromRaw = (body.getamtfrm || '').toString().replace(/,/g, '');
    const amtToRaw = (body.getamtto || '').toString().replace(/,/g, '');
    const amtFrom = parseInt(amtFromRaw, 10);
    const amtTo = body.getamtto === 'All' ? null : parseInt(amtToRaw, 10);

    const rateFilter: any = {};
    if (!isNaN(amtFrom)) rateFilter.gte = amtFrom;
    if (amtTo !== null && !isNaN(amtTo)) rateFilter.lte = amtTo;

    if (Object.keys(rateFilter).length > 0) {
      where.rates = {
        some: {
          nightly: rateFilter
        }
      };
    }

    if (!isCountrySearch && body.check_in && body.check_out) {
      const checkInDate = new Date(body.check_in);
      const checkOutDate = new Date(body.check_out);

      if (!isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime())) {
        const conflictingBookings = await this.prisma.booking.findMany({
          where: {
            theDate: { gte: checkInDate, lte: checkOutDate },
            idState: { in: [1, 2, 3] }
          },
          select: { idItem: true }
        });

        if (conflictingBookings.length > 0) {
          const conflictingItemIds = conflictingBookings.map(b => b.idItem);
          const conflictingBookingItems = await this.prisma.bookingItem.findMany({
            where: { id: { in: conflictingItemIds } },
            select: { idRefExternal: true }
          });
          const conflictingPropertyIds = conflictingBookingItems.map(bi => bi.idRefExternal);

          if (conflictingPropertyIds.length > 0) {
            if (typeof where.id === 'number') {
              if (conflictingPropertyIds.includes(where.id)) where.id = -1;
            } else {
              where.id = { notIn: conflictingPropertyIds };
            }
          }
        }
      }
    }

    const propertiesRaw = await this.prisma.property.findMany({
      where,
      skip, // was limit
      take,
      include: {
        photos: {
          take: 5,
          orderBy: [
            { defaultImage: 'desc' },
            { imageOrder: 'asc' }
          ]
        },
        rates: {
          where: Object.keys(rateFilter).length > 0 ? { nightly: rateFilter } : undefined,
          select: {
            id: true,
            propertyId: true,
            seasonName: true,
            minimumStay: true,
            weekendNight: true,
            nightly: true,
            weekly: true,
            monthly: true
          },
          take: 1,
          orderBy: { nightly: 'asc' }
        }
      },
      orderBy: { id: 'asc' }
    });

    const countryIds = [...new Set(propertiesRaw.map(p => parseInt(p.country as string, 10)).filter(id => !isNaN(id)))];
    const stateIds = [...new Set(propertiesRaw.map(p => parseInt(p.state as string, 10)).filter(id => !isNaN(id)))];
    const propertyCityIds = [...new Set(propertiesRaw.map(p => parseInt(p.city as string, 10)).filter(id => !isNaN(id)))];

    const [countries, states, propertyCities] = await Promise.all([
      countryIds.length > 0 ? this.prisma.country.findMany({ where: { id: { in: countryIds } } }) : [],
      stateIds.length > 0 ? this.prisma.state.findMany({ where: { id: { in: stateIds } } }) : [],
      propertyCityIds.length > 0 ? this.prisma.city.findMany({ where: { id: { in: propertyCityIds } } }) : []
    ]);

    const countryMap = Object.fromEntries(countries.map(c => [c.id, c.name]));
    const stateMap = Object.fromEntries(states.map(s => [s.id, s.name]));
    const cityMap = Object.fromEntries(propertyCities.map(c => [c.id, c.name]));

    const properties = propertiesRaw.map(p => ({
      ...p,
      country: p.country && !isNaN(parseInt(p.country as string, 10)) ? countryMap[parseInt(p.country as string, 10)] || p.country : p.country,
      state: p.state && !isNaN(parseInt(p.state as string, 10)) ? stateMap[parseInt(p.state as string, 10)] || p.state : p.state,
      city: p.city && !isNaN(parseInt(p.city as string, 10)) ? cityMap[parseInt(p.city as string, 10)] || p.city : p.city,
      photos: p.photos.map(photo => ({
        ...photo,
        imageName: process.env.IMG_PATH + 'uploads/property/' + photo.imageName
      }))
    }));

    const totalCount = await this.prisma.property.count({ where });

    return {
      success: properties.length > 0 ? 1 : 0,
      properties: properties,
      prop_count: properties.length,
      totalPropertiesinfilter: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }

  async searchLocations(q: string) {
    if (!q) return [];
    
    const results: any[] = [];
    const propertyId = parseInt(q, 10);
    if (!isNaN(propertyId)) {
      const prop = await this.prisma.property.findUnique({ where: { id: propertyId }});
      if (prop) {
         results.push({ type: 'property', id: prop.id, label: `Property ID: ${prop.id}` });
      }
    }

    const [countries, states, cities] = await Promise.all([
      this.prisma.country.findMany({
        where: { name: { contains: q } },
        take: 5
      }),
      this.prisma.state.findMany({
        where: { name: { contains: q } },
        include: { country: true },
        take: 5
      }),
      this.prisma.city.findMany({
        where: { name: { contains: q } },
        include: { state: { include: { country: true } } },
        take: 10
      })
    ]);

    countries.forEach(c => {
      results.push({ type: 'country', id: c.id, label: c.name });
    });

    states.forEach(s => {
      results.push({ 
        type: 'state', 
        id: s.id, 
        stateId: s.id, 
        label: `${s.name}, ${s.country?.name || ''}`.replace(/,\s*$/, '') 
      });
    });

    cities.forEach(c => {
      const parts = [c.name, c.state?.name, c.state?.country?.name].filter(Boolean);
      results.push({ 
        type: 'city', 
        id: c.id, 
        stateId: c.state?.id, 
        label: parts.join(', ') 
      });
    });

    return results;
  }

  async getListing(query: ListingPropertyDto) {
    const { venue_type, venue_id, check_in, check_out, guest, page = 1 } = query;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const where: any = {};

    if (query.recommended !== undefined) {
      where.recommended = query.recommended;
    }

    // 2. Location Handling
    let locationName = '';
    let isCountrySearch = false;
    if (venue_type && venue_id) {
      if (venue_type === 'countries') {
        isCountrySearch = true;
        const country = await this.prisma.country.findUnique({ where: { id: venue_id } });
        if (country) {
          where.country = String(venue_id);
          locationName = country.name;
        }
      } else if (venue_type === 'states') {
        const state = await this.prisma.state.findUnique({ where: { id: venue_id } });
        if (state) {
          where.state = String(venue_id);
          locationName = state.name;
        }
      } else if (venue_type === 'cities') {
        const city = await this.prisma.city.findUnique({ where: { id: venue_id } });
        if (city) {
          where.city = String(venue_id);
          locationName = city.name;
        }
      }
    } else if (query.venue) {
      const venueStr = query.venue.trim();
      const propertyId = parseInt(venueStr, 10);

      if (!isNaN(propertyId) && venueStr === String(propertyId)) {
        where.id = propertyId;
      } else {
        const exactCountry = await this.prisma.country.findFirst({ where: { name: venueStr } });
        if (exactCountry) isCountrySearch = true;

        where.OR = [
          { propertyHeadline: { contains: venueStr } },
          { city: { contains: venueStr } },
          { state: { contains: venueStr } },
          { country: { contains: venueStr } },
        ];

        if (exactCountry) where.OR.push({ country: String(exactCountry.id) });

        const exactState = await this.prisma.state.findFirst({ where: { name: venueStr } });
        if (exactState) where.OR.push({ state: String(exactState.id) });

        const exactCity = await this.prisma.city.findFirst({ where: { name: venueStr } });
        if (exactCity) where.OR.push({ city: String(exactCity.id) });
      }
    }

    // 1. Guest Handling
    if (!isCountrySearch && guest) {
      const cleanGuest = guest.replace(/^Guests\s*/i, '');
      const guestCount = parseInt(cleanGuest, 10) || 0;
      if (guestCount > 0) {
        where.sleeps = { gte: String(guestCount) };
      }
    }

    // 3. Availability Handling
    if (!isCountrySearch && check_in && check_out) {
      const checkInDate = new Date(check_in);
      const checkOutDate = new Date(check_out);

      if (!isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime())) {
        const conflictingBookings = await this.prisma.booking.findMany({
          where: {
            theDate: { gte: checkInDate, lte: checkOutDate },
            idState: { in: [1, 2, 3] }
          },
          select: { idItem: true }
        });

        if (conflictingBookings.length > 0) {
          const conflictingItemIds = conflictingBookings.map(b => b.idItem);
          const conflictingBookingItems = await this.prisma.bookingItem.findMany({
            where: { id: { in: conflictingItemIds } },
            select: { idRefExternal: true }
          });
          const conflictingPropertyIds = conflictingBookingItems.map(bi => bi.idRefExternal);

          if (conflictingPropertyIds.length > 0) {
            if (typeof where.id === 'number') {
              if (conflictingPropertyIds.includes(where.id)) where.id = -1;
            } else {
              where.id = { notIn: conflictingPropertyIds };
            }
          }
        }
      }
    }

    const totalCount = await this.prisma.property.count({ where });

    let activePropertyTypeIds: number[] = [];
    let activePropertyViewIds: number[] = [];

    if (totalCount > 0) {
      const distinctTypes = await this.prisma.property.findMany({
        where, select: { propertyType: true }, distinct: ['propertyType']
      });
      activePropertyTypeIds = distinctTypes
        .map(t => parseInt(t.propertyType as string, 10))
        .filter(id => !isNaN(id));

      const distinctViews = await this.prisma.property.findMany({
        where, select: { propertyViewId: true }, distinct: ['propertyViewId']
      });
      activePropertyViewIds = distinctViews
        .map(v => v.propertyViewId as number)
        .filter(id => id !== null);
    }

    // 4. Fetch Properties
    const [propertiesRaw, currencies, propertyTypes, propertyViews] = await Promise.all([
      this.prisma.property.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          photos: {
            take: 5,
            orderBy: [
              { defaultImage: 'desc' },
              { imageOrder: 'asc' }
            ]
          },
          rates: {
            select: {
              id: true,
              propertyId: true,
              seasonName: true,
              minimumStay: true,
              weekendNight: true,
              nightly: true,
              weekly: true,
              monthly: true
            },
            take: 1,
            orderBy: { nightly: 'asc' }
          }
        },
        orderBy: { id: 'asc' }
      }),
      this.prisma.currency.findMany({ orderBy: { id: 'asc' } }),
      this.prisma.propertyType.findMany({
        where: activePropertyTypeIds.length > 0 ? { id: { in: activePropertyTypeIds } } : { id: -1 },
        orderBy: { id: 'asc' }
      }),
      this.prisma.propertyView.findMany({
        where: activePropertyViewIds.length > 0 ? { id: { in: activePropertyViewIds } } : { id: -1 },
        orderBy: { id: 'asc' }
      })
    ]);

    const countryIds = [...new Set(propertiesRaw.map(p => parseInt(p.country as string, 10)).filter(id => !isNaN(id)))];
    const stateIds = [...new Set(propertiesRaw.map(p => parseInt(p.state as string, 10)).filter(id => !isNaN(id)))];
    const cityIds = [...new Set(propertiesRaw.map(p => parseInt(p.city as string, 10)).filter(id => !isNaN(id)))];

    const [countries, states, propertyCities] = await Promise.all([
      countryIds.length > 0 ? this.prisma.country.findMany({ where: { id: { in: countryIds } } }) : [],
      stateIds.length > 0 ? this.prisma.state.findMany({ where: { id: { in: stateIds } } }) : [],
      cityIds.length > 0 ? this.prisma.city.findMany({ where: { id: { in: cityIds } } }) : []
    ]);

    const countryMap = Object.fromEntries(countries.map(c => [c.id, c.name]));
    const stateMap = Object.fromEntries(states.map(s => [s.id, s.name]));
    const cityMap = Object.fromEntries(propertyCities.map(c => [c.id, c.name]));

    const properties = propertiesRaw.map(p => ({
      ...p,
      country: p.country && !isNaN(parseInt(p.country as string, 10)) ? countryMap[parseInt(p.country as string, 10)] || p.country : p.country,
      state: p.state && !isNaN(parseInt(p.state as string, 10)) ? stateMap[parseInt(p.state as string, 10)] || p.state : p.state,
      city: p.city && !isNaN(parseInt(p.city as string, 10)) ? cityMap[parseInt(p.city as string, 10)] || p.city : p.city,
      photos: p.photos.map(photo => ({
        ...photo,
        imageName: process.env.IMG_PATH + 'uploads/property/' + photo.imageName
      }))
    }));

    // 5. Property Type Counts (Optimized into a single query)
    const typeCountsRaw = await this.prisma.property.groupBy({
      by: ['propertyType'],
      _count: { _all: true },
      where
    });

    const property_type_count = {};
    for (let i = 1; i <= 19; i++) {
      const countObj = typeCountsRaw.find(t => String(t.propertyType) === String(i));
      property_type_count[i] = countObj ? countObj._count._all : 0;
    }

    // 6. Cities for current location
    let cities: any[] = [];
    if (totalCount > 0) {
      const distinctCities = await this.prisma.property.findMany({
        where,
        select: { city: true },
        distinct: ['city']
      });
      const uniqueCityNames = distinctCities.map(p => p.city).filter(Boolean);
      const parsedIds = uniqueCityNames.map(id => parseInt(id as string, 10)).filter(id => !isNaN(id));

      if (uniqueCityNames.length > 0) {
        cities = await this.prisma.city.findMany({
          where: {
            OR: [
              { id: { in: parsedIds } },
              { name: { in: uniqueCityNames as string[] } }
            ]
          },
          orderBy: { name: 'asc' }
        });
      }
    }

    return {
      properties,
      totalCount,
      showingProperties: properties.length,
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize),
      currency: currencies,
      property_type: propertyTypes,
      property_view: propertyViews,
      property_type_count,
      cities,
      venue_id,
      venue_type,
      venue: query.venue,
      check_in,
      check_out,
      guest
    };
  }
}
