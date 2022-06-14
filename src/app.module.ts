import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './_database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { HashtagModule } from './hashtag/hashtag.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    PostModule,
    CommentModule,
    HashtagModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
