import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { ResponseProp } from 'src/_common/protocol';
import { Hashtag } from 'src/_entity/hashtag.entity';
import { PostEntity } from 'src/_entity/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
    constructor(
        @Inject('POST_REPOSITORY')
        private readonly postRepository: Repository<PostEntity>,
        private readonly hashtagService: HashtagService
    ) {}

    async getPostByUser(userId: number): Promise<PostEntity[]> {
        console.log('Post service - getPostByUser')

        // return await this.postRepository.find({
        //     relations: ['writer'],
        //     where: { writer : { id: user['id'] }}
        // })

        return await this.postRepository
            .createQueryBuilder('post')
            .where('writerId = :id', { id: userId })
            .getMany()
    }

    async getPostById(postId: number): Promise<PostEntity> {
        const post = await this.postRepository.findOne({
            where: { id: postId }
        })

        return post
    }

    async getPostByHashtag(hashtagId: number): Promise<PostEntity[]> {
        const posts = await this.postRepository.find({
            where: {
                hashtags: {
                    id: hashtagId
                }
            },
            relations: ['hashtags']
        })

        return posts
    }

    async createPost(
        userId: number,
        content: string,
        hashtags: string[]
    ): Promise<ResponseProp> {
        console.log('Post service - createPost')

        const result = await this.postRepository.save({
            writer: userId,
            content: content
        })
        const createdPostId = result.id

        // if(hashtags.length > 0) {
        //     await this.hashtagService.createHashtag(createdPostId, hashtags)
        // }

        return {
            status: 200,
            result: {
                success: true
            }
        }
    }
    
    async updatePost(postId: number, postData: UpdatePostDto): Promise<number> {
        console.log('Post service - updatePost')

        const result = await this.postRepository.update(postId, {...postData})
        const affected = result.affected

        if(affected === 0) {
            throw new NotFoundException('존재하지 않는 게시글입니다.')
        }

        return affected
    }

    async deletePost(postId: number): Promise<number> {
        console.log('Post service - deletePost')
    
        const result = await this.postRepository
            .createQueryBuilder()
            .delete()
            .from('post')
            .where("id = :id", { id: postId })
            .execute()
        const affected = result.affected
        
        if(affected === 0) {
            throw new NotFoundException('존재하지 않는 게시글입니다.')
        }

        return affected
    }
}
