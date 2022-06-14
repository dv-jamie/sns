import { Inject, Injectable } from '@nestjs/common';
import { Comment } from 'src/_entity/comment.entity';
import { Post } from 'src/_entity/post.entity';
import { User } from 'src/_entity/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @Inject('COMMENT_REPOSITORY')
        private readonly commentRepository: Repository<Comment>
    ) {}

    async getComments(post: Post): Promise<Comment[]> {
        console.log('Comment Service - getComments')

        return await this.commentRepository.find({
            where: { post: { id: post.id } },
            relations: ['post']
        })
    }

    async createComment(writer: User, commentData: CreateCommentDto, post: Post): Promise<boolean> {
        console.log('Comment Service - createComments')

        await this.commentRepository.save({
            ...commentData,
            writer,
            post
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

        return result.affected
    }
}
