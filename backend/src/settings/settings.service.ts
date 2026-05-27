import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) { }

  // COUNTRY
  async getCountries() {
    return this.prisma.country.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // STATE
  async findStates(options: { skip?: number; take?: number; search?: string; countryId?: number } = {}) {
    const { skip, take, search, countryId } = options;
    const where: any = {};
    if (countryId) where.countryId = countryId;
    if (search) {
      where.name = { contains: search };
    }

    const states = await this.prisma.state.findMany({
      where,
      skip,
      take,
      include: { country: true },
      orderBy: { name: 'asc' },
    });

    return states.map(s => ({
      ...s,
      image: s.image ? process.env.IMG_PATH + 'uploads/states/' + s.image : s.image
    }));
  }

  async countStates(search?: string, countryId?: number) {
    const where: any = {};
    if (countryId) where.countryId = countryId;
    if (search) {
      where.name = { contains: search };
    }
    return this.prisma.state.count({ where });
  }

  async findOneState(id: number) {
    const state = await this.prisma.state.findUnique({ where: { id }, include: { country: true } });
    if (state && state.image) {
      state.image = process.env.IMG_PATH + 'uploads/states/' + state.image;
    }
    return state;
  }

  async createState(data: any) {
    return this.prisma.state.create({
      data: {
        name: data.name,
        image: data.image || '',
        countryId: parseInt(data.countryId),
        stunning: parseInt(data.stunning) || 0,
      },
    });
  }

  async updateState(id: number, data: any) {
    return this.prisma.state.update({
      where: { id },
      data: {
        name: data.name,
        image: data.image !== undefined ? data.image : undefined,
        countryId: data.countryId ? parseInt(data.countryId) : undefined,
        stunning: data.stunning ? parseInt(data.stunning) : undefined,
      },
    });
  }

  async removeState(id: number) {
    return this.prisma.state.delete({ where: { id } });
  }

  // CITY
  async findCities(options: { skip?: number; take?: number; search?: string; stateId?: number; countryId?: number } = {}) {
    const { skip, take, search, stateId, countryId } = options;
    const where: any = {};

    if (stateId) {
      where.stateId = stateId;
    } else if (countryId) {
      where.state = { countryId: countryId };
    }

    if (search) {
      where.name = { contains: search };
    }

    const cities = await this.prisma.city.findMany({
      where,
      skip,
      take,
      include: { state: { include: { country: true } } },
      orderBy: { name: 'asc' },
    });

    return cities.map(c => ({
      ...c,
      image: c.image ? process.env.IMG_PATH + 'uploads/cities/' + c.image : c.image
    }));
  }

  async countCities(search?: string, stateId?: number, countryId?: number) {
    const where: any = {};
    if (stateId) {
      where.stateId = stateId;
    } else if (countryId) {
      where.state = { countryId: countryId };
    }
    if (search) {
      where.name = { contains: search };
    }
    return this.prisma.city.count({ where });
  }

  async findOneCity(id: number) {
    const city = await this.prisma.city.findUnique({ where: { id }, include: { state: true } });
    if (city && city.image) {
      city.image = process.env.IMG_PATH + 'uploads/cities/' + city.image;
    }
    return city;
  }

  async createCity(data: any) {
    return this.prisma.city.create({
      data: {
        name: data.name,
        image: data.image || '',
        stateId: parseInt(data.stateId),
        stunning: parseInt(data.stunning) || 0,
      },
    });
  }

  async updateCity(id: number, data: any) {
    return this.prisma.city.update({
      where: { id },
      data: {
        name: data.name,
        image: data.image !== undefined ? data.image : undefined,
        stateId: data.stateId ? parseInt(data.stateId) : undefined,
        stunning: data.stunning ? parseInt(data.stunning) : undefined,
      },
    });
  }

  async removeCity(id: number) {
    return this.prisma.city.delete({ where: { id } });
  }

  // FEEDBACK
  async findFeedbacks(options: { skip?: number; take?: number; search?: string } = {}) {
    const { skip, take, search } = options;
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { feedbackMessage: { contains: search } },
      ];
    }

    const feedbacks = await this.prisma.feedback.findMany({
      where,
      skip,
      take,
      orderBy: { id: 'desc' },
    });

    const data = feedbacks.map((f) => ({
      id: f.id,
      name: f.name,
      feedbackMessage: f.feedbackMessage,
      userImage: process.env.IMG_PATH + 'uploads/feedback_img/' + f.userImage,
      rating: f.rating,
    }));

    return data;
  }

  async countFeedbacks(search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { feedbackMessage: { contains: search } },
      ];
    }
    return this.prisma.feedback.count({ where });
  }

  async createFeedback(data: any) {
    return this.prisma.feedback.create({
      data: {
        name: data.name,
        feedbackMessage: data.feedbackMessage,
        userImage: `${process.env.IMG_PATH}/uploads/feedback_img/${data.user_image}`,
        rating: String(data.rating || '5'),
      },
    });
  }

  async updateFeedback(id: number, data: any) {
    return this.prisma.feedback.update({
      where: { id },
      data: {
        name: data.name,
        feedbackMessage: data.feedbackMessage,
        userImage: data.userImage !== undefined ? data.userImage : undefined,
        rating: data.rating !== undefined ? String(data.rating) : undefined,
      },
    });
  }

  async removeFeedback(id: number) {
    return this.prisma.feedback.delete({ where: { id } });
  }

  // AMENITY CATEGORIES
  async findAmenityCategories() {
    return this.prisma.amenityCategory.findMany({
      include: { items: true },
    });
  }

  async createAmenityCategory(data: any) {
    return this.prisma.amenityCategory.create({
      data: {
        name: data.name,
      }
    });
  }

  async updateAmenityCategory(id: number, data: any) {
    return this.prisma.amenityCategory.update({
      where: { id },
      data: {
        name: data.name,
      }
    });
  }

  async removeAmenityCategory(id: number) {
    return this.prisma.amenityCategory.delete({ where: { id } });
  }

  // AMENITY ITEMS
  async createAmenityItem(data: any) {
    return this.prisma.amenityItem.create({
      data: {
        name: data.name,
        icon: data.icon || '',
        categoryId: parseInt(data.categoryId),
      }
    });
  }

  async updateAmenityItem(id: number, data: any) {
    return this.prisma.amenityItem.update({
      where: { id },
      data: {
        name: data.name,
        icon: data.icon !== undefined ? data.icon : undefined,
        categoryId: data.categoryId ? parseInt(data.categoryId) : undefined,
      }
    });
  }

  async removeAmenityItem(id: number) {
    return this.prisma.amenityItem.delete({ where: { id } });
  }
}
