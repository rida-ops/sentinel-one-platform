import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async createDepartment(organizationId: string, name: string, code: string) {
    return this.prisma.department.create({
      data: {
        organizationId,
        name,
        code,
      },
    });
  }
}
