import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/_database/database.module';
import { PostController } from './post.controller';
import { postProviders } from './post.provider';
import { PostService } from './post.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PostController],
  providers: [
    ...postProviders,
    PostService
  ]
})
export class PostModule {}
