import {
    Controller,
    UseGuards,
    Request,
    Param,
    Get,
    Post,
    Delete,
    Body,
    NotFoundException,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
        private readonly userService: UserService,
        private readonly postService: PostService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiOperation({ summary: '댓글 불러오기' })
    async getComments(
        @Param('id') postId: number
    ) { // : Promise<Comment[]>
        const post = await this.postService.getPostById(postId)

        if(!post) {
            throw new NotFoundException('존재하지 않는 게시글입니다.')
        }

        return await this.commentService.getComments(post)
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id')
    @ApiOperation({ summary: '댓글 등록' })
    async createComment(
        @Request() req,
        @Param('id') postId: number,
        @Body() commentData // created-comment-dto?
    ): Promise<boolean> {
        const writer = await this.userService.getUserById(req.user.id)
        const post = await this.postService.getPostById(postId)

        if(!post) {
            throw new NotFoundException('존재하지 않는 게시글입니다.')
        }

        return await this.commentService.createComment(writer, commentData, post)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: '댓글 삭제' })
    async deleteComment(
        @Request() req,
        @Param('id') commentId: number,
    ): Promise<number> {
        const affected = await this.commentService.deleteComment(commentId)

        if(affected === 0) {
            throw new NotFoundException('존재하지 않는 댓글입니다.')
        }

        return affected
    }
}
