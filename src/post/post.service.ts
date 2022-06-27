import { HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { ResponseProp } from 'src/_common/protocol';
import { PostEntity } from 'src/_entity/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
    constructor(
        @Inject('POST_REPOSITORY')
        private readonly postRepository: Repository<PostEntity>,
        private readonly hashtagService: HashtagService
    ) {}

    async getPostsByUser(userId: number): Promise<ResponseProp> {
        console.log('Post service - getPostByUser')

        try {
            const posts = await this.postRepository.find({
                where: { writer: { id: userId } },
                relations: ['hashtags', 'comments', 'likers']
            })

            return {
                status: 200,
                result: {
                    success: posts
                }
            }
        } catch(e) {
            console.log(e)

            return {
                status: e.status,
                result: {
                    error: e.message
                }
            }
        }
    }

    async getPostById(postId: number): Promise<ResponseProp> {
        try {
            const post = await this.postRepository.findOne({
                where: { id: postId },
                relations: ['hashtags', 'comments', 'likers']
            })

            if(!post) {
                throw new NotFoundException('존재하지 않는 게시글입니다.')
            }
    
            return {
                status: 200,
                result: {
                    success: post
                }
            }
        } catch(e) {
            console.log(e)

            return {
                status: e.status,
                result: {
                    error: e.message
                }
            }
        }
    }

    async createPost(
        userId: number,
        content: string,
        hashtags: string[]
    ): Promise<ResponseProp> {
        console.log('Post service - createPost')

        try {
            if(typeof hashtags !== 'object') {
                throw new HttpException('해시태그는 배열 형태여야 합니다.', 400);
            }

            const result = await this.postRepository.save({
                writer: { id: userId },
                content: content
            })
            const createdPostId = result.id

            // 해시태그가 있을 경우에만 실행
            if(hashtags.length > 0) {
                await this.hashtagService.createHashtag(createdPostId, hashtags)
            }
    
            return {
                status: 200,
                result: {
                    success: '게시글 생성 완료'
                }
            }
        } catch(e) {
            console.log(e)

            return {
                status: e.status,
                result: {
                    error: e.message
                }
            }
        }

    }
    
    async updatePost(
        postId: number,
        postData: CreatePostDto
    ): Promise<ResponseProp> {
        console.log('Post service - updatePost')

        try {
            const result = await this.postRepository.update(postId, {...postData})
            const affected = result.affected
    
            if(affected === 0) {
                throw new NotFoundException('존재하지 않는 게시글입니다.')
            }
    
            return {
                status: 200,
                result: {
                    success: `${affected}개 게시글 업데이트 완료`
                }
            }
        } catch(e) {
            console.log(e)

            return {
                status: e.status,
                result: {
                    error: e.message
                }
            }
        }
    }

    async deletePost(postId: number): Promise<ResponseProp> {
        console.log('Post service - deletePost')
    
        try {
            const result = await this.postRepository
                .createQueryBuilder()
                .delete()
                .from('post_entity')
                .where("id = :id", { id: postId })
                .execute()
            const affected = result.affected
            
            if(affected === 0) {
                throw new NotFoundException('존재하지 않는 게시글입니다.')
            }
    
            return {
                status: 200,
                result: {
                    success: `${affected}개 게시글 삭제 완료`
                }
            }
        } catch(e) {
            console.log(e)

            return {
                status: e.status,
                result: {
                    error: e.message
                }
            }
        }
    }
}
