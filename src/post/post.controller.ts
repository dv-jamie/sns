import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: '유저별 게시글 불러오기' })
    async getPostByUser(
        @Request() req,
    ): Promise<object> {
        return await this.postService.getPostByUser(req.user.id)
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: '게시글 등록' })
    async createPost(
        @Request() req,
        @Body() postData // 여기에 CreatedPostDto 추가하면 에러, service 인자에서는 에러 x
    ): Promise<object> {
        return await this.postService.createPost(req.user.id, postData)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @ApiOperation({ summary: '게시글 수정' })
    async updatePost(
        @Param('id') postId: number,
        @Body() postData
    ): Promise<number> {
        return await this.postService.updatePost(postId, postData)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: '게시글 삭제' })
    async deletePost(
        @Param('id') postId: number,
    ): Promise<number> {
        return await this.postService.deletePost(postId)
    }
}
