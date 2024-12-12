import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private redis: RedisService) {}

  async createUser(data: Prisma.UserCreateInput) {
    const user = await this.prisma.user.create({ data });
    
    // Cache user in Redis for 1 hour
    await this.redis.set(
      `user:${user.id}`, 
      JSON.stringify(user), 
      3600
    );

    return user;
  }

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(id: string) {
    // Try to get user from Redis first
    const cachedUser = await this.redis.get(`user:${id}`);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    // If not in cache, fetch from database
    const user = await this.prisma.user.findUnique({ where: { id } });
    
    // Cache the user if found
    if (user) {
      await this.redis.set(
        `user:${id}`, 
        JSON.stringify(user), 
        3600
      );
    }

    return user;
  }
}
