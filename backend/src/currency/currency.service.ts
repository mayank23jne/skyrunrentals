import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CurrencyService {
  constructor(private prisma: PrismaService) {}

  async findAll(options: { skip?: number; take?: number; search?: string } = {}) {
    const { skip, take, search } = options;
    const where = search ? {
      OR: [
        { name: { contains: search } },
        { code: { contains: search } },
        { currency: { contains: search } },
      ],
    } : {};

    return this.prisma.currency.findMany({
      where,
      skip,
      take,
      orderBy: { id: 'asc' },
    });
  }

  async count(search?: string) {
    const where = search ? {
      OR: [
        { name: { contains: search } },
        { code: { contains: search } },
        { currency: { contains: search } },
      ],
    } : {};

    return this.prisma.currency.count({ where });
  }

  async findOne(id: number) {
    return this.prisma.currency.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.currency.create({
      data: {
        name: data.name,
        code: data.code,
        conversionRate: parseFloat(data.conversionRate),
        currency: data.currency,
        poundConversion: data.poundConversion,
        currencyCode: parseInt(data.currencyCode) || 2,
      },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.currency.update({
      where: { id },
      data: {
        name: data.name,
        code: data.code,
        conversionRate: parseFloat(data.conversionRate),
        currency: data.currency,
        poundConversion: data.poundConversion,
        currencyCode: parseInt(data.currencyCode) || 2,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.currency.delete({ where: { id } });
  }
}
