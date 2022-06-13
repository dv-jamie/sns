import { Module } from '@nestjs/common';
import { PostModule } from 'src/post/post.module';
import { DatabaseModule } from 'src/_database/database.module';
import { UserController } from './user.controller';
import { userProviders } from './user.provider';
import { UserService } from './user.service';

@Module({
  imports: [
    DatabaseModule,
    PostModule
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [
    ...userProviders,
    UserService
  ]
})
export class UserModule {}
