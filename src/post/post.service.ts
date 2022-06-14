import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Post } from 'src/_entity/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
    constructor(
        @Inject('POST_REPOSITORY')
        private postRepository: Repository<Post>
    ) {}

    async getPostByUser(userId: number): Promise<Post[]> {
        console.log('Post service - getPostByUser')

        // return await this.postRepository.find({
        //     relations: ['writer'],
        //     where: { writer : { id: user['id'] }}
        // })

        return await this.postRepository
            .createQueryBuilder('post')
            .where('writerId = :id', { id: userId })
            .getRawMany()
    }

    async getPostById(postId: number): Promise<Post> {
        const post = await this.postRepository.findOne({
            where: { id: postId }
        })

        return post
    }

    async createPost(userId: number, postData: CreatePostDto): Promise<Post> {
        console.log('Post service - createPost')

        return await this.postRepository.save({
            writer: userId,
            ...postData,
        })
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
