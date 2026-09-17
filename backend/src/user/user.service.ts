import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../db/db.js';
import { userInfo } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { UpdateUserDto } from '../DTO/update-user.dto.js';
import { CreateUserDto } from '../DTO/create-user.dto.js';

@Injectable()
export class UserService {
  // Search for a specific user
  async find(id: string) {
    const [user] = await db.select().from(userInfo).where(eq(userInfo.uid, id));
    if (!user) throw new NotFoundException('User does not exist!');
    return user;
  }

  // Create a new user
  async create(createUserDto: CreateUserDto) {
    const { userName, email } = createUserDto;
    const [user] = await db
      .insert(userInfo)
      .values({ userName, email })
      .returning();
    return user;
  }

  // Update existing user
  async update(id: string, updateUserDto: UpdateUserDto) {
    const [user] = await db
      .update(userInfo)
      .set(updateUserDto)
      .where(eq(userInfo.uid, id))
      .returning();
    if (!user) throw new NotFoundException('User does not exit!');
    return user;
  }

  // Remove existing user
  async delete(id: string) {
    const [user] = await db
      .delete(userInfo)
      .where(eq(userInfo.uid, id))
      .returning();
    if (!user) throw new NotFoundException('User does not exist!');
    return user;
  }

  // WARNING: ONLY FOR DEVELOPMENT PURPOSES!
  async drop() {
    return await db.delete(userInfo);
  }
}
