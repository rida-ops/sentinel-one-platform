import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

@Injectable()
export class RedisService {
  async connect() {
    await redisClient.connect();
  }

  async disconnect() {
    await redisClient.disconnect();
  }

  async get(key: string): Promise<string | null> {
    return redisClient.get(key);
  }

  async set(key: string, value: string, expiresIn?: number): Promise<void> {
    if (expiresIn) {
      await redisClient.setEx(key, expiresIn, value);
    } else {
      await redisClient.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await redisClient.del(key);
  }

  async publish(channel: string, message: string): Promise<void> {
    await redisClient.publish(channel, message);
  }
}

export const redisService = new RedisService();
