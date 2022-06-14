import {
    Controller,
    UseGuards,
    Request,
    Param,
    Get,
    Post,
    Patch,
    Delete,
    Body,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiOperation({ summary: '댓글 불러오기' })
    async getComments(
        @Param('id') postId: number
    ) { // : Promise<Comment[]>
        return await this.commentService.getComments(postId)
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id')
    @ApiOperation({ summary: '댓글 등록' })
    async createComment(
        @Request() req,
        @Param('id') postId: number,
        @Body() commentData // created-comment-dto?
    ): Promise<boolean> {
        return await this.commentService.createComment(req.user.id, commentData, postId)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @ApiOperation({ summary: '댓글 수정' })
    async updateComment(
        @Request() req,
        @Param('id') commentId: number,
        @Body('content') content: string
    ): Promise<boolean> {
        return await this.commentService.updateComment(commentId, content)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: '댓글 삭제' })
    async deleteComment(
        @Request() req,
        @Param('id') commentId: number,
    ): Promise<number> {
        return await this.commentService.deleteComment(commentId)
    }
}
