import { Module } from '@nestjs/common';
import { PostModule } from 'src/post/post.module';
import { UserModule } from 'src/user/user.module';
import { DatabaseModule } from 'src/_database/database.module';
import { CommentController } from './comment.controller';
import { commentProviders } from './comment.provider';
import { CommentService } from './comment.service';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    PostModule
  ],
  controllers: [CommentController],
  providers: [
    ...commentProviders,
    CommentService
  ]
})
export class CommentModule {}
