import {
  Controller,
  Delete,
  Get,
  Param,
  Body,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { UpdateUserDto } from '../DTO/update-user.dto.js';
import { CreateUserDto } from '../DTO/create-user.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  find(@Param('id') id: string) {
    return this.userService.find(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateuserDto: UpdateUserDto) {
    return this.userService.update(id, updateuserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  // REMOVE DURING DEPLOYMENT
  @Delete()
  deleteAll() {
    return this.userService.drop();
  }
}
