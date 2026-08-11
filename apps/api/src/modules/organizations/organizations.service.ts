import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async createOrganization(name: string, slug: string) {
    return this.prisma.organization.create({
      data: { name, slug },
    });
  }
}
