import { forwardRef, Module } from '@nestjs/common';
import { PostModule } from 'src/post/post.module';
import { DatabaseModule } from 'src/_database/database.module';
import { HashtagController } from './hashtag.controller';
import { hashtagProviders } from './hashtag.provider';
import { HashtagService } from './hashtag.service';

@Module({
  imports: [
    DatabaseModule,
    // forwardRef(() => PostModule)
  ],
  exports: [HashtagService],
  controllers: [HashtagController],
  providers: [
    ...hashtagProviders,
    HashtagService
  ]
})
export class HashtagModule {}
