import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/_database/database.module';
import { UserController } from './user.controller';
import { userProviders } from './user.provider';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule],
  exports: [UserService],
  controllers: [UserController],
  providers: [
    ...userProviders,
    UserService
  ]
})
export class UserModule {}
