import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { ContactOwnerDto } from './dto/contact-owner.dto';

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async findContacts(options: { skip?: number; take?: number; search?: string }) {
    const { skip, take, search } = options;
    const where: any = {};

    if (search) {
      where.OR = [
        { firstname: { contains: search } },
        { lastname: { contains: search } },
        { email: { contains: search } },
        { website: { contains: search } },
      ];
    }

    return this.prisma.contactUs.findMany({
      where,
      skip,
      take,
      orderBy: { id: 'desc' },
    });
  }

  async countContacts(search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { firstname: { contains: search } },
        { lastname: { contains: search } },
        { email: { contains: search } },
        { website: { contains: search } },
      ];
    }
    return this.prisma.contactUs.count({ where });
  }

  async deleteContact(id: number) {
    return this.prisma.contactUs.delete({
      where: { id },
    });
  }

  async contactOwner(contactOwnerDto: ContactOwnerDto) {
    const {
      property_id,
      property_owner,
      firstname,
      lastname,
      email,
      country,
      phone,
      arrival,
      departure,
      travel,
      adults,
      childs,
      owner_email,
      message,
    } = contactOwnerDto;

    // 1. Persist to database
    await this.prisma.ownerMessage.create({
      data: {
        propertyId: property_id,
        propertyOwner: property_owner,
        firstname,
        lastname,
        email,
        countryId: country,
        phone,
        arrival: arrival || "",
        departure: departure || "",
        travel: travel || 0,
        adults: adults || 0,
        childs: childs || 0,
        message,
      },
    });

    // 2. Format dates for email like PHP: date('d M Y', strtotime($arrival))
    const formatDate = (dateStr?: string) => {
      if (!dateStr || dateStr === '01 Jan 1970') return '01 Jan 1970';
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '01 Jan 1970';
      
      const day = date.getDate().toString().padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      return `${day} ${month} ${year}`;
    };

    const formattedArrival = formatDate(arrival);
    const formattedDeparture = formatDate(departure);

    // 3. Send Emails
    const dataForEmail = {
      firstname,
      lastname,
      email,
      phone,
      arrival: formattedArrival,
      departure: formattedDeparture,
      travel: travel ? "1" : "0",
      adults: adults || 0,
      childs: childs || 0,
      propertyID: property_id,
      message,
    };

    const fromMail = process.env.SMTP_FROM_EMAIL || 'noreply@holidayhavenhomes.com';
    const otherMail = process.env.OTHER_MAIL_USER || '';
    
    const adminList = [email, fromMail];
    if (otherMail) adminList.push(otherMail);

    // Send to guest/admin list
    await this.mailService.sendContactOwnerEmail(adminList, dataForEmail);

    // Send to owner
    if (owner_email) {
      await this.mailService.sendContactOwnerEmail(owner_email, dataForEmail);
    }

    return {
      firstname: "",
      lastname: "",
      email: "",
      country: "",
      phone: "",
      message: "",
      success: '<div class="msgalerts"><span class="alert alert-success">Enquiry Submitted Successfully</span></div>',
    };
  }
}
