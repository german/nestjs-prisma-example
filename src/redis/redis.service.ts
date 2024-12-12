import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
  private readonly redisClient;

  constructor() {
    this.redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    this.redisClient.on('error', (err) => 
      console.error('Redis Client Error', err)
    );

    this.connect();
  }

  private async connect() {
    await this.redisClient.connect();
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      return this.redisClient.set(key, value, { EX: ttl });
    }
    return this.redisClient.set(key, value);
  }

  async get(key: string) {
    return this.redisClient.get(key);
  }

  async delete(key: string) {
    return this.redisClient.del(key);
  }
}
