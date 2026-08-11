import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  permissions: string[];
  org_id: string;
  jti: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod';
const JWT_EXPIRES_IN = 900; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = 604800; // 7 days

export function generateJwt(payload: Omit<JwtPayload, 'iat' | 'exp' | 'jti'>): {
  token: string;
  expiresIn: number;
} {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + JWT_EXPIRES_IN;
  const jti = nanoid();

  const token = jwt.sign(
    {
      ...payload,
      jti,
      iat: now,
      exp,
    },
    JWT_SECRET,
    { algorithm: 'HS256' }
  );

  return {
    token,
    expiresIn: JWT_EXPIRES_IN,
  };
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });

    return decoded as JwtPayload;
  } catch (error) {
    return null;
  }
}

export function generateRefreshToken(): {
  token: string;
  expiresAt: Date;
} {
  const token = nanoid(64);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000);

  return {
    token,
    expiresAt,
  };
}
