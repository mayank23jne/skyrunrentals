import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import Stripe from 'stripe';
import { SquareClient, SquareEnvironment } from 'square';

@Injectable()
export class PaymentService {
  private stripe: any;

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {
    const stripeKey = process.env.STRIPE_PRIVATE_KEY || 'sk_test_placeholder';
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16' as any,
    });
  }

  async getPaymentDetails(planIdBase64: string, userId: number, sessionCurrencyId?: number) {
    let planId: number;
    try {
      planId = parseInt(Buffer.from(planIdBase64, 'base64').toString('ascii'), 10);
    } catch (e) {
      planId = parseInt(planIdBase64, 10);
    }

    const [currencies, user, selectedPlan, allPlans, usdCurrency] = await Promise.all([
      this.prisma.currency.findMany({ orderBy: { id: 'asc' } }),
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.plan.findUnique({ where: { id: planId } }),
      this.prisma.plan.findMany({ orderBy: { id: 'asc' } }),
      this.prisma.currency.findFirst({ where: { code: 'USD' } }),
    ]);

    let currencyCode: any = null;
    if (sessionCurrencyId) {
      currencyCode = await this.prisma.currency.findUnique({ where: { id: sessionCurrencyId } });
    }

    return {
      currency: currencies,
      CurrencyCode: currencyCode ? [currencyCode] : [],
      user_data: user,
      selected_plan: selectedPlan,
      plan_data: allPlans,
      getCurrencyPound: usdCurrency,
      page_title: 'Payment',
    };
  }

  async stripePayBooking(body: any) {
    const {
      amount,
      propertyId,
      property_owner,
      firstName,
      lastName,
      phoneCode,
      Email,
      Message,
      street,
      mobile,
      country,
      city,
      zip,
      terms,
      adults,
      childs,
      booking_dates,
      stripeToken,
    } = body;

    // 1. Initial Insert into property_bookings
    const propertyBooking = await this.prisma.propertyBooking.create({
      data: {
        propertyId: parseInt(propertyId, 10),
        propertyOwner: parseInt(property_owner, 10) || null,
        firstName: firstName || "",
        lastName: lastName || "",
        email: Email || "",
        mobile: `${phoneCode} ${mobile}`,
        message: Message || "",
        street: street || "",
        country: country.toString(),
        city: city || "",
        zip: zip || "",
        terms: parseInt(terms, 10) || 0,
        adults: parseInt(adults, 10) || 0,
        childs: parseInt(childs, 10) || 0,
        amount: amount.toString(),
        status: 'pending',
        response: "",
        bookingDates: booking_dates || "",
        createdAt: new Date(),
      },
    });

    // 2. Stripe Payment
    let charge;
    let result = 'declined';

    try {
      const amountCents = Math.round(parseFloat(amount) * 100);
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountCents,
        currency: 'usd',
        payment_method: stripeToken || 'pm_card_visa',
        confirm: true,
        description: `Booking #${propertyBooking.id} - Property ${propertyId}`,
        automatic_payment_methods: { enabled: true, allow_redirects: 'never' }
      });

      if (paymentIntent.status === 'succeeded') {
        charge = paymentIntent;
        result = 'success';
      }
    } catch (error) {
      console.error('Stripe Error:', error.message);
      result = 'declined';
    }

    if (result === 'success') {
      // 3. Update Calendar
      const bookingDatesArr = booking_dates.split(',');
      const firstDate = bookingDatesArr[0];
      const lastDate = bookingDatesArr[bookingDatesArr.length - 1];

      // Fetch states
      const states = await this.prisma.bookingState.findMany();
      const bookedState = states.find(s => s.code === 'BOOKED')?.id || 1;
      const bookedAmState = states.find(s => s.code === 'BKDAM')?.id || 2;

      await this.prisma.$transaction(async (tx) => {
        let bookingItem = await tx.bookingItem.findFirst({
          where: { idRefExternal: parseInt(propertyId, 10) }
        });

        if (!bookingItem) {
          bookingItem = await tx.bookingItem.create({
            data: {
              idRefExternal: parseInt(propertyId, 10),
              descEn: `Property ${propertyId}`,
              idUser: 1
            }
          });
        }

        const datesToProcess = [...bookingDatesArr];
        if (datesToProcess.length > 1) {
          const finalDate = datesToProcess.pop() as string;
          const finalDateObj = new Date(finalDate);
          finalDateObj.setHours(12, 0, 0, 0);

          const existing = await tx.booking.findFirst({
            where: { idItem: bookingItem.id, theDate: finalDateObj }
          });

          if (existing) {
            await tx.booking.update({
              where: { id: existing.id },
              data: { idState: bookedAmState }
            });
          } else {
            await tx.booking.create({
              data: {
                idItem: bookingItem.id,
                theDate: finalDateObj,
                idState: bookedAmState,
                idBooking: 0
              }
            });
          }
        }

        for (const dateStr of datesToProcess) {
          const dateObj = new Date(dateStr);
          dateObj.setHours(12, 0, 0, 0);

          const existing = await tx.booking.findFirst({
            where: { idItem: bookingItem.id, theDate: dateObj }
          });

          if (existing) {
            await tx.booking.update({
              where: { id: existing.id },
              data: { idState: bookedState }
            });
          } else {
            await tx.booking.create({
              data: {
                idItem: bookingItem.id,
                theDate: dateObj,
                idState: bookedState,
                idBooking: 0
              }
            });
          }
        }

        // Update PropertyBooking
        await tx.propertyBooking.update({
          where: { id: propertyBooking.id },
          data: {
            status: 'success',
            response: JSON.stringify(charge),
            bookingDates: booking_dates,
          }
        });
      });

      // 4. Send Emails
      const countryData = await this.prisma.country.findFirst({ 
        where: { id: parseInt(country, 10) || undefined, name: country } 
      });
      const owner = await this.prisma.user.findUnique({ 
        where: { id: parseInt(property_owner, 10) } 
      });

      const emailData = {
        firstName,
        lastName,
        propertyId,
        mobile: `${phoneCode} ${mobile}`,
        amount,
        email: Email,
        firstDate,
        lastDate,
        adults,
        childs,
        street,
        city,
        countryName: countryData?.name || country,
        zip,
      };

      const recipients = [Email];
      if (owner?.email) recipients.push(owner.email);
      recipients.push(process.env.SMTP_USER || 'noreply@holidayhavenhomes.com');
      if (process.env.OTHER_MAIL_USER) recipients.push(process.env.OTHER_MAIL_USER);

      await this.mailService.sendBookingPaymentEmail(recipients, emailData);

      return 'success';
    }

    return 'declined';
  }

  async prepareBookingPayment(body: any, sessionCurrencyId?: number) {
    const propertyId = parseInt(body.property_id, 10);
    if (isNaN(propertyId)) {
      return null;
    }

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const [
      countries,
      property,
      bookings,
      image,
      rates,
      propertyExtras,
      currency,
    ] = await Promise.all([
      this.prisma.country.findMany({ orderBy: { id: 'asc' } }),
      this.prisma.property.findUnique({ where: { id: propertyId } }),
      this.prisma.booking.findMany({
        where: {
          idItem: propertyId,
          theDate: { gte: todayDate },
        },
      }),
      this.prisma.photo.findMany({
        where: { propertyId: propertyId },
        orderBy: { imageOrder: 'asc' },
      }),
      this.prisma.rate.findMany({
        where: { propertyId: propertyId },
      }),
      this.prisma.propertyExtra.findFirst({
        where: { propertyId: propertyId },
      }),
      this.prisma.currency.findMany({ orderBy: { id: 'asc' } }),
    ]);

    let currencyCode: any = '';
    if (sessionCurrencyId) {
      currencyCode = await this.prisma.currency.findMany({
        where: { id: sessionCurrencyId },
      });
    }

    return {
      countries,
      fetch_perNIGHT: body.fetch_perNIGHT,
      property_owner: body.property_owner,
      checkin_book: body.checkin_book,
      checkout_book: body.checkout_book,
      Selectadults: body.Selectadults,
      Selectchilds: body.Selectchilds,
      booking_dates: body.booking_dates,
      property_id: body.property_id,
      total_amount: body.total_amount,
      taxamount: body.taxamount,
      full_place: body.full_place,
      property,
      bookings,
      image,
      rates,
      property_extras: propertyExtras,
      currency,
      CurrencyCode: currencyCode,
    };
  }

  async paypalBookingDetails(body: any, currencyShortForm: string = 'USD') {
    const {
      property_id,
      property_owner,
      adult,
      child,
      amount,
      booking_dates,
      first_name,
      last_name,
      email,
      phonecode,
      mobile,
      message,
      street,
      country,
      city,
      zip,
      terms,
    } = body;

    const insert = await this.prisma.propertyBooking.create({
      data: {
        propertyId: parseInt(property_id, 10),
        propertyOwner: parseInt(property_owner, 10) || null,
        firstName: first_name || '',
        lastName: last_name || '',
        email: email || '',
        mobile: `${phonecode || ''} ${mobile || ''}`.trim(),
        message: message || '',
        adults: parseInt(adult, 10) || 0,
        childs: parseInt(child, 10) || 0,
        street: street || '',
        country: country || '',
        city: city || '',
        zip: zip || '',
        terms: parseInt(terms, 10) || 0,
        amount: amount ? amount.toString() : '0',
        bookingDates: booking_dates || '',
        status: 'pending',
        response: '',
        createdAt: new Date(),
      },
    });

    const PAYPAL_ID = 'buzzvacation@gmail.com';
    const PAYPAL_SANDBOX = false;
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const PAYPAL_RETURN_URL = `${baseUrl}/home/booking_success`;
    const PAYPAL_CANCEL_URL = `${baseUrl}/home/booking_cancel`;
    const PAYPAL_NOTIFY_URL = `${backendUrl}/payment/ipn`;
    const PAYPAL_URL = PAYPAL_SANDBOX
      ? 'https://www.sandbox.paypal.com/cgi-bin/webscr'
      : 'https://www.paypal.com/cgi-bin/webscr';

    const formHtml = `
      <form action="${PAYPAL_URL}" method="post" id="paypalformsubmit" target="_top">
        <input type="hidden" name="business" value="${PAYPAL_ID}">
        <input type="hidden" name="id" value="${insert.id}">
        <input type="hidden" name="cmd" value="_xclick">
        <input type="hidden" name="item_number" id="item_number" value="1">
        <input type="hidden" name="amount" id="amount" value="${amount}">
        <input type="hidden" name="rm" value="2">
        <input type="hidden" name="hosted_button_id" value="FW8ZGN4W46CQ8">
        <input type="hidden" name="return" value="${PAYPAL_RETURN_URL}">
        <input type="hidden" name="notify_url" value="${PAYPAL_NOTIFY_URL}">
        <input type="hidden" name="cancel_return" value="${PAYPAL_CANCEL_URL}">
        <input type="hidden" name="currency_code" value="${currencyShortForm}">
        <input type="image" name="submit" id="submit" border="0" src="https://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif">
      </form>
    `;

    return {
      success: true,
      payment_id: insert.id,
      booking_dates,
      property_id,
      html: formHtml,
    };
  }

  async paypalBookingSuccess(body: any) {
    const paymentId = parseInt(body.payment_id, 10);
    const paymentStatus = body.payment_status || 'Completed';

    if (isNaN(paymentId)) {
      return { success: false, message: 'Invalid payment ID' };
    }

    if (paymentStatus === 'Completed') {
      const propertyBooking = await this.prisma.propertyBooking.findUnique({
        where: { id: paymentId },
      });

      if (!propertyBooking) {
        return { success: false, message: 'Booking not found' };
      }

      if (propertyBooking.status === 'success') {
        return { success: true, message: 'Already processed' };
      }

      const bookingDatesArr = propertyBooking.bookingDates.split(',').filter(d => d.trim() !== '');
      if (bookingDatesArr.length === 0) {
        return { success: false, message: 'No booking dates found' };
      }

      const firstDate = bookingDatesArr[0];
      const lastDate = bookingDatesArr[bookingDatesArr.length - 1];

      const bookedState = 1;
      const bookedAmState = 2;

      await this.prisma.$transaction(async (tx) => {
        const datesToProcess = [...bookingDatesArr];
        
        if (datesToProcess.length > 1) {
          const finalDate = datesToProcess.pop() as string;
          const finalDateObj = new Date(finalDate);
          finalDateObj.setHours(12, 0, 0, 0);

          const existing = await tx.booking.findFirst({
            where: { idItem: propertyBooking.propertyId, theDate: finalDateObj }
          });

          if (existing) {
            await tx.booking.update({
              where: { id: existing.id },
              data: { idState: bookedAmState }
            });
          } else {
            await tx.booking.create({
              data: {
                idItem: propertyBooking.propertyId,
                theDate: finalDateObj,
                idState: bookedAmState,
                idBooking: 0
              }
            });
          }
        }

        for (const dateStr of datesToProcess) {
          const dateObj = new Date(dateStr);
          dateObj.setHours(12, 0, 0, 0);

          const existing = await tx.booking.findFirst({
            where: { idItem: propertyBooking.propertyId, theDate: dateObj }
          });

          if (existing) {
            await tx.booking.update({
              where: { id: existing.id },
              data: { idState: bookedState }
            });
          } else {
            await tx.booking.create({
              data: {
                idItem: propertyBooking.propertyId,
                theDate: dateObj,
                idState: bookedState,
                idBooking: 0
              }
            });
          }
        }

        await tx.propertyBooking.update({
          where: { id: propertyBooking.id },
          data: {
            status: 'success',
            response: JSON.stringify(body),
            amount: body.payment_gross || propertyBooking.amount,
          }
        });
      });

      const countryData = await this.prisma.country.findFirst({ 
        where: { id: parseInt(propertyBooking.country, 10) || undefined, name: propertyBooking.country } 
      });
      const owner = await this.prisma.user.findUnique({ 
        where: { id: propertyBooking.propertyOwner || -1 } 
      });

      const emailData = {
        firstName: propertyBooking.firstName,
        lastName: propertyBooking.lastName,
        propertyId: propertyBooking.propertyId,
        mobile: propertyBooking.mobile,
        amount: body.payment_gross || propertyBooking.amount,
        email: propertyBooking.email,
        firstDate,
        lastDate,
        adults: propertyBooking.adults,
        childs: propertyBooking.childs,
        street: propertyBooking.street,
        city: propertyBooking.city,
        countryName: countryData?.name || propertyBooking.country,
        zip: propertyBooking.zip,
      };

      const recipients = [propertyBooking.email];
      if (owner?.email) recipients.push(owner.email);
      recipients.push(process.env.SMTP_USER || 'noreply@holidayhavenhomes.com');
      if (process.env.OTHER_MAIL_USER) recipients.push(process.env.OTHER_MAIL_USER);

      await this.mailService.sendBookingPaymentEmail(recipients, emailData);

      return { success: true, message: 'Booking confirmed' };
    }

    return { success: false, message: 'Payment not completed' };
  }

  async paypalBookingCancel(body: any) {
    const paymentId = parseInt(body.payment_id, 10);
    
    if (isNaN(paymentId)) {
      return { success: false, message: 'Invalid payment ID' };
    }

    await this.prisma.propertyBooking.update({
      where: { id: paymentId },
      data: {
        status: 'Cancelled',
        response: '0',
      }
    });

    return { success: true, message: 'Booking cancelled' };
  }

  async squarePay(body: any, userReq: any) {
    const isSandbox = process.env.SQ_ON === 'SANDBOX';
    const accessToken = isSandbox
      ? process.env.SQ_ACCESSTOKEN_SANDBOX
      : process.env.SQ_ACCESSTOKEN_LIVE || 'EAAAFORfY5MLs23gmXyJr1UJh55jz3nYTXo75TjUvnsimF5xaVMVN5eRmEoHh4Fo';

    const environment = isSandbox ? SquareEnvironment.Sandbox : SquareEnvironment.Production;

    const squareClient = new SquareClient({
      token: accessToken,
      environment,
    });

    try {
      const paymentsApi = squareClient.payments;

      if (!body.sourceId) {
        return { status: 'error', msg: 'Source ID missing' };
      }

      const amountCents = Math.round(parseFloat(body.amountInDollars) * 100);
      const invoiceId = Math.floor(10000000 + Math.random() * 90000000).toString();

      const response = await paymentsApi.create({
        sourceId: body.sourceId,
        idempotencyKey: invoiceId,
        amountMoney: {
          amount: BigInt(amountCents),
          currency: 'USD',
        },
      });

      const responseData = JSON.stringify(response, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      );

      const planType = parseInt(body.plan, 10) || 0;
      let description = '';
      if (planType === 4) {
        description = body.description1 || '';
      }

      await this.prisma.paymentDetail.create({
        data: {
          transactionBy: 2, // 2 indicates Square
          response: responseData,
          status: 'success',
          userId: userReq.id,
          planType,
          noOfProperty: parseInt(body.no_of_property, 10) || 0,
          description,
          amount: body.amountInDollars.toString(),
          createdDate: new Date(),
        },
      });

      const user = await this.prisma.user.findUnique({
        where: { id: userReq.id },
      });

      if (user) {
        const newSubscriptionType = user.subscription_type + (parseInt(body.total_property, 10) || 0);
        await this.prisma.user.update({
          where: { id: user.id },
          data: { subscription_type: newSubscriptionType },
        });

        const planNames = {
          1: 'Gold',
          2: 'Silver',
          3: 'Bronze',
          4: 'Holiday Rental Special Plan',
        };
        const mailPlan = planNames[planType] || ' ';

        const emailData = {
          firstName: user.firstname,
          lastName: user.lastname,
          userId: user.id,
          plan: mailPlan,
          amount: body.amountInDollars,
          totalProperty: body.no_of_property,
          date: new Date().toISOString(),
        };

        const recipients = [user.email, 'buzzvacation@gmail.com'];
        await this.mailService.sendSquarePaymentEmail(recipients, emailData);
      }

      return { status: 'success' };
    } catch (error) {
      console.error('Square payment error:', error);
      return { status: 'error', msg: 'Payment fail please try again !' };
    }
  }

  async squarePayBooking(body: any) {
    const propertyId = parseInt(body.propertyId, 10);
    const propertyOwner = parseInt(body.property_owner, 10) || null;
    const amount = body.amount ? body.amount.toString() : '0';
    const amountCents = Math.round(parseFloat(amount) * 100);

    const propertyBooking = await this.prisma.propertyBooking.create({
      data: {
        propertyId,
        propertyOwner,
        firstName: body.firstName || '',
        lastName: body.lastName || '',
        email: body.Email || '',
        mobile: (body.phoneCode || '') + ' ' + (body.mobile || ''),
        message: body.Message || '',
        street: body.street || '',
        country: body.country || '',
        city: body.city || '',
        zip: body.zip || '',
        terms: parseInt(body.terms, 10) || 0,
        adults: parseInt(body.adults, 10) || 0,
        childs: parseInt(body.childs, 10) || 0,
        bookingDates: body.booking_dates || '',
        status: 'pending',
        response: '',
        amount,
        createdAt: new Date(),
      },
    });

    if (!body.sourceId) {
      return { status: 'error', msg: 'Source ID missing' };
    }

    const isSandbox = process.env.SQ_ON === 'SANDBOX';
    const accessToken = isSandbox
      ? process.env.SQ_ACCESSTOKEN_SANDBOX
      : process.env.SQ_ACCESSTOKEN_LIVE || 'EAAAFORfY5MLs23gmXyJr1UJh55jz3nYTXo75TjUvnsimF5xaVMVN5eRmEoHh4Fo';

    const environment = isSandbox ? SquareEnvironment.Sandbox : SquareEnvironment.Production;

    const squareClient = new SquareClient({
      token: accessToken,
      environment,
    });

    try {
      const invoiceId = Math.floor(10000000 + Math.random() * 90000000).toString();

      const response = await squareClient.payments.create({
        sourceId: body.sourceId,
        idempotencyKey: invoiceId,
        amountMoney: {
          amount: BigInt(amountCents),
          currency: 'USD',
        },
      });

      const responseData = JSON.stringify(response, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      );

      const bookingDatesArr = (body.booking_dates || '').split(',').filter((d: string) => d.trim() !== '');
      let firstDate = '';
      let lastDate = '';

      if (bookingDatesArr.length > 0) {
        firstDate = bookingDatesArr[0];
        lastDate = bookingDatesArr[bookingDatesArr.length - 1];

        await this.prisma.$transaction(async (tx) => {
          const datesToProcess = [...bookingDatesArr];

          if (datesToProcess.length > 1) {
            const finalDate = datesToProcess.pop() as string;
            const finalDateObj = new Date(finalDate);
            finalDateObj.setHours(12, 0, 0, 0);

            const existing = await tx.booking.findFirst({
              where: { idItem: propertyId, theDate: finalDateObj }
            });

            if (existing) {
              await tx.booking.update({
                where: { id: existing.id },
                data: { idState: 2 } // 2 for half booked
              });
            } else {
              await tx.booking.create({
                data: {
                  idItem: propertyId,
                  theDate: finalDateObj,
                  idState: 2,
                  idBooking: 0
                }
              });
            }
          }

          for (const dateStr of datesToProcess) {
            const dateObj = new Date(dateStr);
            dateObj.setHours(12, 0, 0, 0);

            const existing = await tx.booking.findFirst({
              where: { idItem: propertyId, theDate: dateObj }
            });

            if (existing) {
              await tx.booking.update({
                where: { id: existing.id },
                data: { idState: 1 } // 1 for full booked
              });
            } else {
              await tx.booking.create({
                data: {
                  idItem: propertyId,
                  theDate: dateObj,
                  idState: 1,
                  idBooking: 0
                }
              });
            }
          }

          await tx.propertyBooking.update({
            where: { id: propertyBooking.id },
            data: {
              status: 'success',
              response: responseData,
            }
          });
        });

        const countryData = await this.prisma.country.findFirst({
          where: { id: parseInt(body.country, 10) || undefined }
        });

        const owner = await this.prisma.user.findUnique({
          where: { id: propertyOwner || -1 }
        });

        const emailData = {
          firstName: body.firstName,
          lastName: body.lastName,
          propertyId,
          mobile: propertyBooking.mobile,
          amount,
          email: body.Email,
          firstDate,
          lastDate,
          adults: propertyBooking.adults,
          childs: propertyBooking.childs,
          street: propertyBooking.street,
          city: propertyBooking.city,
          countryName: countryData?.name || propertyBooking.country,
          zip: propertyBooking.zip,
          transactionBy: 'Square',
        };

        const recipients = [propertyBooking.email];
        if (owner?.email) recipients.push(owner.email);
        recipients.push(process.env.SMTP_USER || 'noreply@holidayhavenhomes.com');
        if (process.env.OTHER_MAIL_USER) recipients.push(process.env.OTHER_MAIL_USER);

        await this.mailService.sendBookingPaymentEmail(recipients, emailData);
      } else {
        await this.prisma.propertyBooking.update({
          where: { id: propertyBooking.id },
          data: {
            status: 'success',
            response: responseData,
          }
        });
      }

      return { status: 'success' };
    } catch (error) {
      console.error('Square payment booking error:', error);
      
      const responseData = typeof error === 'object' ? JSON.stringify(error, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      ) : String(error);

      await this.prisma.propertyBooking.update({
        where: { id: propertyBooking.id },
        data: {
          status: 'error',
          response: responseData,
        }
      });
      return { status: 'error', msg: 'Payment fail please try again !' };
    }
  }

  async paymentInit(body: any, userReq: any) {
    const currency = 'USD';

    if (body.request_type === 'create_payment_intent') {
      const itemName = body.itemName || '';
      const itemPrice = body.itemPrice || 0;
      const plantype = body.plantype || '';
      const description = `${itemName}+${plantype}`;
      const itemPriceCents = Math.round(parseFloat(itemPrice.toString()) * 100);

      try {
        const paymentIntent = await this.stripe.paymentIntents.create({
          amount: itemPriceCents,
          currency,
          description,
          automatic_payment_methods: { enabled: true },
        });

        return { id: paymentIntent.id, clientSecret: paymentIntent.client_secret };
      } catch (error: any) {
        return { error: error.message };
      }
    } else if (body.request_type === 'create_customer') {
      const payment_intent_id = body.payment_intent_id;
      const name = body.name || '';
      const email = body.email || '';

      try {
        const customer = await this.stripe.customers.create({ name, email });
        if (customer) {
          await this.stripe.paymentIntents.update(payment_intent_id, {
            customer: customer.id,
          });
          return { id: payment_intent_id, customer_id: customer.id };
        }
      } catch (error: any) {
        return { error: error.message };
      }
    } else if (body.request_type === 'payment_insert') {
      const payment_intent = body.payment_intent;
      const customer_id = body.customer_id;
      const choose_property = body.choose_property;

      try {
        let customer: any = null;
        if (customer_id) {
          customer = await this.stripe.customers.retrieve(customer_id);
        }

        if (payment_intent && payment_intent.status === 'succeeded') {
          const transaction_id = payment_intent.id;
          const paid_amount = payment_intent.amount / 100;
          const payment_status = payment_intent.status;
          const descriptionRaw = payment_intent.description || '';
          
          const str_des = descriptionRaw.split('+');
          const description = str_des[0] || '';
          const plantype = str_des[1] || '';

          const customer_name = customer?.name || '';
          const customer_email = customer?.email || '';

          const existing = await this.prisma.paymentDetail.findFirst({
            where: { data: transaction_id }
          });

          if (!existing) {
            const arr = [
              customer_name, customer_email, descriptionRaw, paid_amount,
              'USD', paid_amount, 'USD', transaction_id, payment_status, plantype
            ];
            const responseStr = arr.join(',');

            await this.prisma.paymentDetail.create({
              data: {
                transactionBy: 1, // Stripe
                data: transaction_id,
                status: payment_status,
                userId: userReq.id,
                planType: parseInt(plantype, 10) || 0,
                noOfProperty: parseInt(choose_property, 10) || 0,
                createdDate: new Date(),
                response: responseStr,
                amount: paid_amount.toString(),
                description,
              }
            });
          }

          if (payment_status === 'succeeded') {
            const user = await this.prisma.user.findUnique({
              where: { id: userReq.id }
            });

            if (user) {
              const newSub = user.subscription_type + (parseInt(choose_property, 10) || 0);
              await this.prisma.user.update({
                where: { id: user.id },
                data: { subscription_type: newSub }
              });

              const planTypeInt = parseInt(plantype, 10);
              const planNames: Record<number, string> = {
                1: 'Gold', 2: 'Silver', 3: 'Bronze', 4: 'Holiday Rental Special Plan'
              };
              const mailplan = planNames[planTypeInt] || ' ';

              const emailData = {
                firstName: user.firstname,
                lastName: user.lastname,
                userId: user.id,
                plan: mailplan,
                amount: paid_amount,
                totalProperty: choose_property,
                date: new Date().toISOString(),
                transactionBy: 'Stripe',
              };

              const recipients = [user.email, process.env.SMTP_USER || 'noreply@holidayhavenhomes.com'];
              await this.mailService.sendSquarePaymentEmail(recipients, emailData);
            }
          }

          return { payment_txn_id: Buffer.from(transaction_id).toString('base64') };
        } else {
          return { error: 'Transaction has been failed!' };
        }
      } catch (error: any) {
        return { error: error.message };
      }
    }
  }

  async paymentInitBooking(body: any) {
    const currency = 'USD';

    if (body.request_type === 'create_payment_intent') {
      const itemName = body.itemName || '';
      const itemPrice = body.itemPrice || 0;
      const description = itemName;
      const itemPriceCents = Math.round(parseFloat(itemPrice.toString()) * 100);

      try {
        const paymentIntent = await this.stripe.paymentIntents.create({
          amount: itemPriceCents,
          currency,
          description,
          automatic_payment_methods: { enabled: true },
        });

        return { id: paymentIntent.id, clientSecret: paymentIntent.client_secret };
      } catch (error: any) {
        return { error: error.message };
      }
    } else if (body.request_type === 'create_customer') {
      const payment_intent_id = body.payment_intent_id;
      const name = body.name || '';
      const email = body.email || '';

      try {
        const customer = await this.stripe.customers.create({ name, email });
        if (customer) {
          await this.stripe.paymentIntents.update(payment_intent_id, {
            customer: customer.id,
          });
          return { id: payment_intent_id, customer_id: customer.id };
        }
      } catch (error: any) {
        return { error: error.message };
      }
    } else if (body.request_type === 'payment_insert') {
      const payment_intent = body.payment_intent;
      const customer_id = body.customer_id;

      try {
        let customer: any = null;
        if (customer_id) {
          customer = await this.stripe.customers.retrieve(customer_id);
        }

        if (payment_intent && payment_intent.status === 'succeeded') {
          const transaction_id = payment_intent.id;
          const paid_amount = payment_intent.amount / 100;
          const payment_status = payment_intent.status;
          const descriptionRaw = payment_intent.description || '';
          
          const str_des = descriptionRaw.split('>');
          const first_name = str_des[0] || '';
          const last_name = str_des[1] || '';
          const email = str_des[2] || '';
          const mobile = str_des[3] || '';
          const street = str_des[4] || '';
          const city = str_des[5] || '';
          const zip = str_des[6] || '';
          const termsStr = str_des[7] || '';
          const booking_dates = str_des[8] || '';
          const adults = str_des[9] || '0';
          const childs = str_des[10] || '0';
          const booking_message = str_des[13] || '';
          const propertyId = parseInt(str_des[14] || '0', 10);
          const property_owner = parseInt(str_des[15] || '0', 10) || null;
          const country = str_des[16] || '';

          const term = termsStr ? 1 : 0;
          const status = payment_status === 'succeeded' ? 'success' : 'Cancelled';

          const existing = await this.prisma.propertyBooking.findFirst({
            where: { transactionId: transaction_id }
          });

          let propertyBookingId = 0;

          if (existing) {
            propertyBookingId = existing.id;
          } else {
            const inserted = await this.prisma.propertyBooking.create({
              data: {
                propertyId,
                propertyOwner: property_owner,
                firstName: first_name,
                lastName: last_name,
                email,
                mobile,
                message: booking_message,
                street,
                country,
                city,
                zip,
                terms: term,
                adults: parseInt(adults, 10),
                childs: parseInt(childs, 10),
                createdAt: new Date(),
                response: descriptionRaw,
                status,
                amount: paid_amount.toString(),
                bookingDates: booking_dates,
                transactionId: transaction_id,
              }
            });
            propertyBookingId = inserted.id;
          }

          if (payment_status === 'succeeded') {
            const bookingDatesArr = booking_dates.split(',').filter(d => d.trim() !== '');
            let firstDate = '';
            let lastDate = '';

            if (bookingDatesArr.length > 0) {
              firstDate = bookingDatesArr[0];
              lastDate = bookingDatesArr[bookingDatesArr.length - 1];

              await this.prisma.$transaction(async (tx) => {
                const datesToProcess = [...bookingDatesArr];

                if (datesToProcess.length > 1) {
                  const finalDate = datesToProcess.pop() as string;
                  const finalDateObj = new Date(finalDate);
                  finalDateObj.setHours(12, 0, 0, 0);

                  const bExists = await tx.booking.findFirst({
                    where: { idItem: propertyId, theDate: finalDateObj }
                  });

                  if (bExists) {
                    await tx.booking.update({
                      where: { id: bExists.id },
                      data: { idState: 2 }
                    });
                  } else {
                    await tx.booking.create({
                      data: { idItem: propertyId, theDate: finalDateObj, idState: 2, idBooking: 0 }
                    });
                  }
                }

                for (const dateStr of datesToProcess) {
                  const dateObj = new Date(dateStr);
                  dateObj.setHours(12, 0, 0, 0);

                  const bExists = await tx.booking.findFirst({
                    where: { idItem: propertyId, theDate: dateObj }
                  });

                  if (bExists) {
                    await tx.booking.update({
                      where: { id: bExists.id },
                      data: { idState: 1 }
                    });
                  } else {
                    await tx.booking.create({
                      data: { idItem: propertyId, theDate: dateObj, idState: 1, idBooking: 0 }
                    });
                  }
                }
              });

              const countryData = await this.prisma.country.findFirst({
                where: { id: parseInt(country, 10) || undefined }
              });

              const owner = await this.prisma.user.findUnique({
                where: { id: property_owner || -1 }
              });

              const emailData = {
                firstName: first_name,
                lastName: last_name,
                propertyId,
                mobile,
                amount: paid_amount,
                email,
                firstDate,
                lastDate,
                adults,
                childs,
                street,
                city,
                countryName: countryData?.name || country,
                zip,
                transactionBy: 'Stripe',
              };

              const recipients = [email];
              if (owner?.email) recipients.push(owner.email);
              recipients.push(process.env.SMTP_USER || 'noreply@holidayhavenhomes.com');
              if (process.env.OTHER_MAIL_USER) recipients.push(process.env.OTHER_MAIL_USER);

              await this.mailService.sendBookingPaymentEmail(recipients, emailData);
            }
          }

          return { payment_txn_id: Buffer.from(transaction_id).toString('base64') };
        } else {
          return { error: 'Transaction has been failed!' };
        }
      } catch (error: any) {
        return { error: error.message };
      }
    }
  }

  async addNewRateOnSlot(body: any) {
    const id = parseInt(body.id, 10);
    const seasonName = body.season_name || 'Peak Season';
    const startDateRaw = body.start_date;
    const endDateRaw = body.end_date;
    const nightly = body.nightly ? parseFloat(body.nightly) : 0;

    if (!id || !startDateRaw || !endDateRaw) {
      return { error: 'Missing required parameters' };
    }

    const startD = new Date(startDateRaw);
    const endD = new Date(endDateRaw);

    const rateArray: Record<string, number> = {};

    let currentD = new Date(startD);
    while (currentD <= endD) {
      const currentDateStr = currentD.toISOString().split('T')[0];
      const targetDate = new Date(currentDateStr);
      targetDate.setHours(12, 0, 0, 0);

      // Update or create rate for this exact single day
      const existingRate = await this.prisma.rate.findFirst({
        where: {
          propertyId: id,
          startDate: targetDate,
          endDate: targetDate,
        }
      });

      if (existingRate) {
        await this.prisma.rate.update({
          where: { id: existingRate.id },
          data: {
            seasonName,
            nightly,
          }
        });
      } else {
        await this.prisma.rate.create({
          data: {
            propertyId: id,
            seasonName,
            startDate: targetDate,
            endDate: targetDate,
            nightly,
          }
        });
      }

      // Delete existing bookings for this date to effectively clear the slot
      await this.prisma.booking.deleteMany({
        where: {
          idItem: id,
          theDate: targetDate
        }
      });

      // Find the effective rate for the day to return
      const effectiveRate = await this.prisma.rate.findFirst({
        where: {
          propertyId: id,
          startDate: { lte: targetDate },
          endDate: { gte: targetDate },
        }
      });

      if (effectiveRate) {
        rateArray[currentDateStr] = typeof effectiveRate.nightly === 'string' ? parseFloat(effectiveRate.nightly) : (effectiveRate.nightly || 0);
      } else {
        const standRate = await this.prisma.rate.findFirst({
          where: {
            propertyId: id,
            seasonName: { contains: 'stand' }
          }
        });
        rateArray[currentDateStr] = standRate ? (typeof standRate.nightly === 'string' ? parseFloat(standRate.nightly) : (standRate.nightly || 0)) : 0;
      }

      currentD.setDate(currentD.getDate() + 1);
    }

    return rateArray;
  }
}
