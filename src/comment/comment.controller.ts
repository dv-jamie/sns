import {
    Controller,
    UseGuards,
    Request,
    Param,
    Post,
    Patch,
    Delete,
    Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ResponseProp } from 'src/_common/protocol';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
@ApiTags('Comment')
@ApiBearerAuth('accesskey')
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post(':postId')
    @ApiOperation({ summary: '댓글 등록' })
    @ApiBody({ type: CreateCommentDto })
    async createComment(
        @Request() req,
        @Param('postId') postId: number,
        @Body() commentData
    ): Promise<ResponseProp> {
        return await this.commentService.createComment(req.user.id, commentData, postId)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @ApiOperation({ summary: '댓글 수정' })
    @ApiBody({ type: CreateCommentDto })
    async updateComment(
        @Request() req,
        @Param('id') commentId: number,
        @Body('content') content: string
    ): Promise<ResponseProp> {
        return await this.commentService.updateComment(commentId, content)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: '댓글 삭제' })
    async deleteComment(
        @Request() req,
        @Param('id') commentId: number,
    ): Promise<ResponseProp> {
        return await this.commentService.deleteComment(commentId)
    }
}
