import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verifyPassword, generateJwt, generateRefreshToken } from '@sentinel/auth';
import { PrismaService } from '../../prisma.service';
import { RedisService } from '../../redis.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private redis: RedisService
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: {
        organization: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get user permissions
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { role: user.role },
      include: { permission: true },
    });

    const permissions = rolePermissions.map(rp => rp.permission.name);

    // Generate JWT
    const { token: accessToken, expiresIn } = generateJwt({
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions,
      org_id: user.organizationId,
    });

    // Generate refresh token
    const { token: refreshToken, expiresAt } = generateRefreshToken();
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
      },
    });

    // Create session
    await this.prisma.session.create({
      data: {
        userId: user.id,
        deviceId: 'device-id', // TODO: extract from request
        ipAddress: '127.0.0.1', // TODO: extract from request
        userAgent: 'user-agent', // TODO: extract from request
        expiresAt: new Date(Date.now() + expiresIn * 1000),
      },
    });

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        permissions,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    const token = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!token || token.expiresAt < new Date() || token.revokedAt) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = token.user;

    // Get user permissions
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { role: user.role },
      include: { permission: true },
    });

    const permissions = rolePermissions.map(rp => rp.permission.name);

    // Generate new JWT
    const { token: accessToken, expiresIn } = generateJwt({
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions,
      org_id: user.organizationId,
    });

    // Generate new refresh token
    const { token: newRefreshToken, expiresAt } = generateRefreshToken();
    await this.prisma.refreshToken.update({
      where: { id: token.id },
      data: { revokedAt: new Date() },
    });

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: newRefreshToken,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
    };
  }
}
