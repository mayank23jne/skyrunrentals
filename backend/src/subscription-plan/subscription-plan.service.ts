import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionPlanService {
  constructor(private prisma: PrismaService) {}

  async findAll(options: { skip?: number; take?: number; search?: string } = {}) {
    const { skip, take, search } = options;
    const where = search ? {
      OR: [
        { planName: { contains: search } },
        { description1: { contains: search } },
      ],
    } : {};

    return this.prisma.plan.findMany({
      where,
      skip,
      take,
      orderBy: { id: 'asc' },
    });
  }

  async count(search?: string) {
    const where = search ? {
      OR: [
        { planName: { contains: search } },
        { description1: { contains: search } },
      ],
    } : {};
    return this.prisma.plan.count({ where });
  }

  async findOne(id: number) {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
    });
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  async create(data: any) {
    return this.prisma.plan.create({
      data: {
        planName: data.planName,
        price: data.price,
        description1: data.description1 || '',
        description2: data.description2 || '',
        description3: data.description3 || '',
        description4: data.description4 || '',
        description5: data.description5 || '',
        description6: data.description6 || '',
        description7: data.description7 || '',
        description8: data.description8 || '',
        description9: data.description9 || '',
        description10: data.description10 || '',
        description11: data.description11 || '',
        description12: data.description12 || '',
        description13: data.description13 || '',
      },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.plan.update({
      where: { id },
      data: {
        planName: data.planName,
        price: data.price,
        description1: data.description1 || '',
        description2: data.description2 || '',
        description3: data.description3 || '',
        description4: data.description4 || '',
        description5: data.description5 || '',
        description6: data.description6 || '',
        description7: data.description7 || '',
        description8: data.description8 || '',
        description9: data.description9 || '',
        description10: data.description10 || '',
        description11: data.description11 || '',
        description12: data.description12 || '',
        description13: data.description13 || '',
      },
    });
  }

  async remove(id: number) {
    return this.prisma.plan.delete({
      where: { id },
    });
  }
}
