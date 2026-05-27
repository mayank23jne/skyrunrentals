import { Controller, Get, Param, ParseIntPipe, Post, Query, Req, Res, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ContactService } from './contact.service';
import { Public } from '../auth/decorators/public.decorator';
import { ContactOwnerDto } from './dto/contact-owner.dto';

@ApiTags('Admin/Contacts')
@ApiBearerAuth()
@Controller('admin/contacts')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('0', '2')
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  @Get()
  @ApiOperation({ summary: 'Get all contacts' })
  async getContacts(
    @Req() req,
    @Res() res: Response,
    @Query('page') page: string = '1',
    @Query('search') search?: string,
    @Query('ajax') ajax?: string
  ) {
    const pageSize = 10;
    const currentPage = parseInt(page, 10) || 1;
    const skippedItems = (currentPage - 1) * pageSize;

    const [contacts, totalCount] = await Promise.all([
      this.contactService.findContacts({ skip: skippedItems, take: pageSize, search }),
      this.contactService.countContacts(search),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const data = {
      admin: { ...req.user, username: req.user.username || req.user.email || 'Admin' },
      activePage: 'contacts',
      pageTitle: 'Contacts Management',
      contacts,
      totalPages,
      currentPage,
      totalCount,
      searchQuery: search || ''
    };

    if (ajax === 'true') {
      return res.render('contacts/partials/table-rows', data);
    }

    return res.render('contacts/listing', data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/delete')
  @ApiOperation({ summary: 'Delete a contact' })
  async deleteContact(@Param('id', ParseIntPipe) id: number) {
    await this.contactService.deleteContact(id);
    return { success: true };
  }

  @Public()
  @Post('contact-owner')
  @ApiOperation({ summary: 'Contact property owner' })
  @ApiResponse({ status: 201, description: 'Enquiry submitted successfully' })
  async contactOwner(@Body() contactOwnerDto: ContactOwnerDto) {
    return this.contactService.contactOwner(contactOwnerDto);
  }
}

