import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';
import { Comment } from 'src/_entity/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @Inject('COMMENT_REPOSITORY')
        private readonly commentRepository: Repository<Comment>,
        private readonly userService: UserService,
        private readonly postService: PostService
    ) {}

    async getComments(postId: number): Promise<Comment[]> {
        console.log('Comment Service - getComments')

        const post = await this.postService.getPostById(postId)

        if(!post) {
            throw new NotFoundException('존재하지 않는 게시글입니다.')
        }

        return await this.commentRepository.find({
            where: { post: { id: post.id } },
            relations: ['post']
        })
    }

    async createComment(writerId: number, commentData: CreateCommentDto, postId: number): Promise<boolean> {
        console.log('Comment Service - createComments')

        const writer = await this.userService.getUserById(writerId)
        const post = await this.postService.getPostById(postId)

        if(!post) {
            throw new NotFoundException('존재하지 않는 게시글입니다.')
        }

        await this.commentRepository.save({
            ...commentData,
            writer,
            post
        })

        return true
    }

    async updateComment(commentId: number, content: string): Promise<boolean> {
        console.log('Comment Service - updateComments')

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

        return true
    }

    async deleteComment(commentId: number): Promise<number> {
        console.log('Comment Service - deleteComments')

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

        return affected
    }
}
