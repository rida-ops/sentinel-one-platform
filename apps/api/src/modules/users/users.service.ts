import { Injectable } from '@nestjs/common';
import { hashPassword } from '@sentinel/auth';
import { CreateUserInput } from '@sentinel/validation';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async listUsers(organizationId: string) {
    return this.prisma.user.findMany({
      where: { organizationId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createUser(data: CreateUserInput, organizationId: string) {
    const passwordHash = await hashPassword(data.password);

    return this.prisma.user.create({
      data: {
        email: data.email,
        username: data.email.split('@')[0],
        firstName: data.firstName,
        lastName: data.lastName,
        passwordHash,
        role: data.role as any,
        organizationId,
        departmentId: data.departmentId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
