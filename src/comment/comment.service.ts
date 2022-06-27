import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PostService } from 'src/post/post.service';
import { ResponseProp } from 'src/_common/protocol';
import { Comment } from 'src/_entity/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @Inject('COMMENT_REPOSITORY')
        private readonly commentRepository: Repository<Comment>,
        private readonly postService: PostService
    ) {}

    async createComment(
        writerId: number,
        commentData: CreateCommentDto,
        postId: number
    ): Promise<ResponseProp> {
        console.log('Comment Service - createComments')

        try {
            const responseProp = await this.postService.getPostById(postId)
            const post = responseProp.result.success
    
            if(!post) {
                throw new NotFoundException('존재하지 않는 게시글입니다.')
            }
    
            await this.commentRepository.save({
                writer: writerId,
                post: postId,
                ...commentData,
            })

            return {
                status: 200,
                result: {
                    success: '댓글 생성 완료'
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

    async updateComment(
        commentId: number,
        content: string
    ): Promise<ResponseProp> {
        console.log('Comment Service - updateComments')

        try {
            const comment = await this.commentRepository.findOne({
                where: { id: commentId }
            })
    
            if(!comment) {
                throw new NotFoundException('존재하지 않는 댓글입니다.')
            }
            comment.content = content
    
            await this.commentRepository.save({
                ...comment
            })
    
            return {
                status: 200,
                result: {
                    success: '댓글 수정 완료'
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

    async deleteComment(commentId: number): Promise<ResponseProp> {
        console.log('Comment Service - deleteComments')

        try {
            const result = await this.commentRepository
                .createQueryBuilder()
                .delete()
                .from('comment')
                .where('id = :id', { id: commentId })
                .execute()
            const affected = result.affected
    
            if(affected === 0) {
                throw new NotFoundException('존재하지 않는 댓글입니다.')
            }
    
            return {
                status: 200,
                result: {
                    success: `${affected}의 댓글이 삭제되었습니다.`
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
