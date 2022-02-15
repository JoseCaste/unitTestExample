import { Module } from '@nestjs/common';
import { UserService } from './user/users.service';
import { ContactsController } from './user/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { Document } from 'src/models/document.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [ContactsController],
  exports:[UserService]
})
export class UserModule {}
