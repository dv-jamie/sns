import { Inject, Injectable } from '@nestjs/common';
import { Post } from 'src/_entity/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
    constructor(
        @Inject('POST_REPOSITORY')
        private postRepository: Repository<Post>
    ) {}

    async createPost(user: object, postData: CreatePostDto): Promise<any> {
        console.log('Post service - createPost')

        return await this.postRepository.save({
            writer: user['id'],
            ...postData,
        })
    }
}
