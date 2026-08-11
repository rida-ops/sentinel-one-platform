import { hash, verify } from 'argon2';

const ARGON2_OPTIONS = {
  timeCost: 2,
  memoryCost: 65536,
  parallelism: 4,
  type: 'argon2id' as const,
};

export async function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    return await verify(hash, password);
  } catch (error) {
    return false;
  }
}

export function validatePasswordPolicy(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letters');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letters');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain numbers');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain special characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
