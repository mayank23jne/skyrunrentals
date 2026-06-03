import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) { }

  // --- PROPERTY BOOKINGS ---
  async findPropertyBookings(options: { skip?: number; take?: number; search?: string; ownerId?: number }) {
    const { skip, take, search, ownerId } = options;
    const where: any = {};

    if (ownerId !== undefined) {
      where.propertyOwner = ownerId;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { transactionId: { contains: search } },
      ];
    }

    return this.prisma.propertyBooking.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countPropertyBookings(search?: string, ownerId?: number) {
    const where: any = {};
    
    if (ownerId !== undefined) {
      where.propertyOwner = ownerId;
    }
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { transactionId: { contains: search } },
      ];
    }
    return this.prisma.propertyBooking.count({ where });
  }
  async findPropertyBookingById(id: number) {
    return this.prisma.propertyBooking.findUnique({
      where: { id },
      include: {
        property: true,
      },
    });
  }

  // --- BOOKING ENQUIRIES (OwnerMessages) ---
  async findEnquiries(options: { skip?: number; take?: number; search?: string; ownerId?: number }) {
    const { skip, take, search, ownerId } = options;
    const where: any = {};

    if (ownerId !== undefined) {
      where.propertyOwner = ownerId;
    }

    if (search) {
      where.OR = [
        { firstname: { contains: search } },
        { lastname: { contains: search } },
        { email: { contains: search } },
      ];
    }

    return this.prisma.ownerMessage.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countEnquiries(search?: string, ownerId?: number) {
    const where: any = {};
    
    if (ownerId !== undefined) {
      where.propertyOwner = ownerId;
    }
    if (search) {
      where.OR = [
        { firstname: { contains: search } },
        { lastname: { contains: search } },
        { email: { contains: search } },
      ];
    }
    return this.prisma.ownerMessage.count({ where });
  }

  // --- PAYMENT HISTORY (Transactions) ---
  async findTransactions(options: { skip?: number; take?: number; search?: string; ownerId?: number }) {
    const { skip, take, search, ownerId } = options;
    const where: any = {};

    if (ownerId !== undefined) {
      where.userId = ownerId;
    }

    if (search) {
      where.OR = [
        { status: { contains: search } },
        { amount: { contains: search } },
        { user: { firstname: { contains: search } } },
        { user: { lastname: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
    }

    const transactions = await this.prisma.paymentDetail.findMany({
      where,
      skip,
      take,
      include: {
        user: true,
      },
      orderBy: { createdDate: 'desc' },
    });

    const plans = await this.prisma.plan.findMany();
    const planMap = new Map(plans.map(p => [p.id, p.planName]));

    return transactions.map(tx => ({
      ...tx,
      planName: (tx.planType ? planMap.get(tx.planType) : null) || null,
    }));
  }

  async countTransactions(search?: string, ownerId?: number) {
    const where: any = {};
    
    if (ownerId !== undefined) {
      where.userId = ownerId;
    }
    if (search) {
      where.OR = [
        { status: { contains: search } },
        { amount: { contains: search } },
        { user: { firstname: { contains: search } } },
        { user: { lastname: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
    }
    return this.prisma.paymentDetail.count({ where });
  }

  async deleteEnquiry(id: number) {
    return this.prisma.ownerMessage.delete({
      where: { id },
    });
  }

  async fetchCalendarBookings(idItem: number) {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-indexed
    const year = now.getFullYear();

    // Matching the PHP logic: MONTH(the_date) >= currentMonth AND YEAR(the_date) == currentYear
    // Though gte: firstDayOfMonth would be better, we follow the PHP pattern for parity.
    const bookings = await this.prisma.booking.findMany({
      where: {
        idItem: idItem,
        theDate: {
          gte: new Date(`${year}-${month.toString().padStart(2, '0')}-01`),
        },
      },
    });

    return bookings.map(booking => {
      let className = '';
      let title = '';
      let bookingId: any = booking.id;

      if (booking.idState === 3) {
        className = 'booked_pm';
        title = 'Booked PM ';
      } else if (booking.idState === 2) {
        className = 'booked_am';
        title = 'Booked AM ';
      } else if (booking.idState === 1) {
        className = 'booked';
        title = 'Booked ';
        bookingId = 'test'; // Per PHP code
      }

      return {
        classNames: [booking.id, className],
        start: booking.theDate.toISOString().split('T')[0],
        title: title,
        booking_id: bookingId,
      };
    });
  }

  private getDatesFromRange(startDate: string, endDate: string): string[] {
      const dates: string[] = [];
      let current = new Date(startDate);
      const end = new Date(endDate);
      while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
      return dates;
    }

  async fetchEvents(idItem: number) {
      const start = new Date();
      start.setFullYear(start.getFullYear() - 10);
      const end = new Date();
      end.setFullYear(end.getFullYear() + 50);

      const startDateStr = start.toISOString().split('T')[0];
      const endDateStr = end.toISOString().split('T')[0];

      const allDates = this.getDatesFromRange(startDateStr, endDateStr);

      const bookings = await this.prisma.booking.findMany({
        where: { idItem },
        select: { theDate: true }
      });

      const bookedDatesSet = new Set(bookings.map(b => b.theDate.toISOString().split('T')[0]));
      const notBooked = allDates.filter(date => !bookedDatesSet.has(date));

      return notBooked.map(date => ({
        start: date,
        title: date,
        color: "#fff",
        className: "not_booked",
      }));
    }

  async rateEvents(propertyId: number) {
      const start = new Date();
      start.setFullYear(start.getFullYear() - 10);
      const end = new Date();
      end.setFullYear(end.getFullYear() + 50);

      const startDateStr = start.toISOString().split('T')[0];
      const endDateStr = end.toISOString().split('T')[0];

      const allDates = this.getDatesFromRange(startDateStr, endDateStr);

      // Fetch non-standard rates
      const rates = await this.prisma.rate.findMany({
        where: {
          propertyId,
          NOT: {
            seasonName: { contains: 'Stand' }
          }
        }
      });

      // Fetch standard rate
      const standRate = await this.prisma.rate.findFirst({
        where: {
          propertyId,
          seasonName: { contains: 'Stand' }
        }
      });

      const ratesDateSet = new Set<string>();
      for (const rate of rates) {
        if (rate.startDate && rate.endDate) {
          const range = this.getDatesFromRange(
            rate.startDate.toISOString().split('T')[0],
            rate.endDate.toISOString().split('T')[0]
          );
          range.forEach(d => ratesDateSet.add(d));
        }
      }

      const gapDates = allDates.filter(date => !ratesDateSet.has(date));

      const price = standRate ? `$${standRate.nightly}` : '$0';

      return gapDates.map(date => ({
        start: date,
        title: price,
        color: "#00000000",
        className: "rate-event",
        textColor: "black",
      }));
    }

  async seasonRatesEvents(propertyId: number) {
    const rates = await this.prisma.rate.findMany({
      where: {
        propertyId,
        NOT: {
          seasonName: { contains: 'Stand' }
        }
      }
    });

    return rates.map(rate => {
      const start = rate.startDate ? rate.startDate.toISOString().split('T')[0] : '';
      let end = '';
      if (rate.endDate) {
        const endDate = new Date(rate.endDate);
        endDate.setDate(endDate.getDate() + 1);
        end = endDate.toISOString().split('T')[0];
      }

      return {
        start,
        end,
        title: `$${rate.nightly}`,
        className: "season-price",
        textColor: "white",
      };
    });
  }

  async bookingEvents(idItem: number) {
    const bookings = await this.prisma.booking.findMany({
      where: { idItem }
    });

    return bookings.map(booking => {
      let className = '';
      if (booking.idState === 3) {
        className = "book-pm";
      } else if (booking.idState === 2) {
        className = "book-am";
      } else if (booking.idState === 1) {
        className = "book-event";
      }

      const dateStr = booking.theDate.toISOString().split('T')[0];

      return {
        start: dateStr,
        title: dateStr,
        color: "#00cb7b",
        className: className,
        textColor: "#00cb7b",
      };
    });
  }

  async fetchBookingRates(propertyId: number) {
    const now = new Date();
    const startD = new Date(now.getFullYear(), now.getMonth(), 1); // Y-m-1
    const endD = new Date();
    endD.setMonth(endD.getMonth() + 3);

    // Fetch all rates for this property
    const allRates = await this.prisma.rate.findMany({
      where: { propertyId }
    });

    const standardRate = allRates.find(r => r.seasonName?.toLowerCase().includes('stand'));
    const seasonalRates = allRates.filter(r => !r.seasonName?.toLowerCase().includes('stand'));

    const rateMap: Record<string, number> = {};
    let current = new Date(startD);
    current.setDate(current.getDate() + 1); // Start from day 2 as per PHP logic ($i=1)

    while (current <= endD) {
      const dateStr = current.toISOString().split('T')[0];
      const matchingRate = seasonalRates.find(r => {
        if (!r.startDate || !r.endDate) return false;
        const d = new Date(dateStr);
        return d >= r.startDate && d <= r.endDate;
      });

      if (matchingRate) {
        rateMap[dateStr] = matchingRate.nightly || 0;
      } else if (standardRate) {
        rateMap[dateStr] = standardRate.nightly || 0;
      } else {
        rateMap[dateStr] = 0;
      }

      current.setDate(current.getDate() + 1);
    }

    return rateMap;
  }

  async fetchCalendarBookingAvailable(idItem: number) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() + 1);
    const endDate = new Date(startDate); // Same as PHP snippet

    const bookings = await this.prisma.booking.findMany({
      where: {
        idItem,
        theDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Fetch rates for this property to get the nightly price
    // Since we only have idItem (which is likely the external ID or linked to property)
    // We need to find the property first or use the idItem directly if it matches propertyId.
    // In this schema, BookingItem.idRefExternal seems to be the propertyId.
    const bookingItem = await this.prisma.bookingItem.findUnique({
      where: { id: idItem }
    });

    const propertyId = bookingItem ? bookingItem.idRefExternal : idItem;

    const allRates = await this.prisma.rate.findMany({
      where: { propertyId }
    });

    const standardRate = allRates.find(r => r.seasonName?.toLowerCase().includes('stand'));
    const seasonalRates = allRates.filter(r => !r.seasonName?.toLowerCase().includes('stand'));

    return bookings.map(booking => {
      const dateStr = booking.theDate.toISOString().split('T')[0];
      const day = booking.theDate.getDate().toString().padStart(2, '0');

      // Find rate for this specific day
      const matchingRate = seasonalRates.find(r => {
        if (!r.startDate || !r.endDate) return false;
        return booking.theDate >= r.startDate && booking.theDate <= r.endDate;
      });

      const rate = matchingRate?.nightly || standardRate?.nightly || 0;
      const title = `${day} $${rate}`;

      let className = '';
      let bookingId: any = booking.id;

      if (booking.idState === 3) {
        className = 'booked_pm';
      } else if (booking.idState === 2) {
        className = 'booked_am';
      } else if (booking.idState === 1) {
        className = 'booked';
        bookingId = 'test';
      }

      return {
        classNames: className,
        start: dateStr,
        title: title,
        booking_id: bookingId,
      };
    });
  }

  async updateFullCalendarBooking(idItem: number, date: string, bookingStatus: number) {
    const theDate = new Date(date);
    
    // Set time to noon to avoid timezone shift issues when comparing dates
    theDate.setHours(12, 0, 0, 0);

    if (bookingStatus === 0) {
      // Delete the record if status is 0
      try {
        await this.prisma.booking.deleteMany({
          where: {
            idItem,
            theDate: {
              equals: theDate
            }
          }
        });
        return "Success";
      } catch (error) {
        return "Fail";
      }
    } else {
      // Find existing record
      const existing = await this.prisma.booking.findFirst({
        where: {
          idItem,
          theDate: {
            equals: theDate
          }
        }
      });

      if (existing) {
        // Update
        try {
          await this.prisma.booking.update({
            where: { id: existing.id },
            data: { idState: bookingStatus }
          });
          return "Success";
        } catch (error) {
          return "Fail";
        }
      } else {
        // Insert
        try {
          await this.prisma.booking.create({
            data: {
              idItem,
              theDate: theDate,
              idState: bookingStatus,
              idBooking: 0
            }
          });
          return "Success";
        } catch (error) {
          return "Fail";
        }
      }
    }
  }

  async getBookingRates(propertyId: number, selectedDates: string[]) {
    if (!selectedDates || selectedDates.length === 0) {
      return { error: 'Not Available' };
    }

    const allRates: number[] = [];
    const nightlyRates: number[] = [];

    const totalDates = selectedDates.length;
    const datesToProcess = [...selectedDates];

    const getRateForDate = async (dateStr: string) => {
      const targetDate = new Date(dateStr);
      
      const specificRate = await this.prisma.rate.findFirst({
        where: {
          propertyId,
          startDate: { lte: targetDate },
          endDate: { gte: targetDate }
        }
      });

      if (specificRate) return specificRate;

      return await this.prisma.rate.findFirst({
        where: {
          propertyId,
          seasonName: { contains: 'stand' }
        }
      });
    };

    if (totalDates > 1) {
      const lastdate = datesToProcess.pop() as string;
      const rateObj = await getRateForDate(lastdate);

      if (rateObj) {
        const dateObj = new Date(lastdate);
        const dayOfWeek = dateObj.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        let rateVal = typeof rateObj.nightly === 'string' ? parseFloat(rateObj.nightly) : (rateObj.nightly || 0);
        if (isWeekend && rateObj.weekendNight) {
          rateVal = typeof rateObj.weekendNight === 'string' ? parseFloat(rateObj.weekendNight) : rateObj.weekendNight;
        }
        allRates.push(rateVal / 2);
        nightlyRates.push(rateVal / 2);
      } else {
        allRates.push(0);
        nightlyRates.push(0);
      }
    }

    for (const dateStr of datesToProcess) {
      const rateObj = await getRateForDate(dateStr);
      const targetDate = new Date(dateStr);
      targetDate.setHours(12, 0, 0, 0);

      const halfBooked = await this.prisma.booking.findFirst({
        where: {
          idItem: propertyId,
          theDate: targetDate
        }
      });

      let rateVal = 0;
      if (rateObj) {
        const dateObj = new Date(dateStr);
        const dayOfWeek = dateObj.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        rateVal = typeof rateObj.nightly === 'string' ? parseFloat(rateObj.nightly) : (rateObj.nightly || 0);
        if (isWeekend && rateObj.weekendNight) {
          rateVal = typeof rateObj.weekendNight === 'string' ? parseFloat(rateObj.weekendNight) : rateObj.weekendNight;
        }
      }

      if (halfBooked) {
        allRates.push(rateVal / 2);
        nightlyRates.push(rateVal / 2);
      } else {
        allRates.push(rateVal);
        nightlyRates.push(rateVal);
      }
    }

    if (allRates.length > 0) {
      const propertyExtras = await this.prisma.propertyExtra.findFirst({
        where: { propertyId }
      });

      if (propertyExtras) {
        const getNum = (str: string | null) => parseFloat((str || '').replace(/[^0-9.]/g, '')) || 0;
        
        const petFee = getNum(propertyExtras.petFee);
        const cleaningFee = getNum(propertyExtras.cleaningFee);
        const taxesRaw = getNum(propertyExtras.taxes);
        const damageProtection = getNum(propertyExtras.damageProtection);

        allRates.push(petFee);
        allRates.push(cleaningFee);

        const currentSum = allRates.reduce((a, b) => a + b, 0);
        const taxShow = (taxesRaw * currentSum) / 100;
        allRates.push(taxShow);
        
        allRates.push(damageProtection);

        const nightlySum = nightlyRates.reduce((a, b) => a + b, 0);
        const countNights = Math.max(1, nightlyRates.length - (totalDates > 1 ? 1 : 0));
        
        return {
          tax: Math.round(taxShow),
          nightlyRates: nightlySum,
          total_amount: Math.round(allRates.reduce((a, b) => a + b, 0)),
          allRates: nightlyRates[0] || 0,
          countNights: countNights
        };
      }
    }

    return { error: 'Not Available' };
  }
}
