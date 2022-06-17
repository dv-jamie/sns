import {
    Controller,
    UseGuards,
    Request,
    Param,
    Get,
    Post,
    Body,
    Patch,
    Delete,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { ResponseDto } from 'src/_common/dto/response.dto';
import { ResponseProp } from 'src/_common/protocol';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('post')
@ApiTags('Post')
@ApiBearerAuth('accesskey')
export class PostController {
    constructor(
        private readonly postService: PostService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: '유저별 게시글 불러오기' })
    @ApiOkResponse({ description: '게시글 불러오기 완료', type: ResponseDto })
    async getPostByUser(
        @Request() req,
    ): Promise<ResponseProp> {
        return await this.postService.getPostsByUser(req.user.id)
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiOperation({ summary: '하나의 게시글 불러오기' })
    @ApiOkResponse({ description: '게시글 불러오기 완료', type: ResponseDto })
    async getPostById(
        @Request() req,
        @Param('id') postId: number
    ): Promise<ResponseProp> {
        return await this.postService.getPostById(postId)
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: '게시글 등록' })
    @ApiBody({ description: '게시글 내용과 해시태그 배열', type: CreatePostDto })
    @ApiOkResponse({ description: '게시글 등록 완료', type: ResponseDto })
    async createPost(
        @Request() req,
        @Body('content') content: string,
        @Body('hashtags') hashtags: string[]
    ): Promise<ResponseProp> {
        return await this.postService.createPost(req.user.id, content, hashtags)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @ApiOperation({ summary: '게시글 수정' })
    @ApiBody({ description: '게시글 내용과 해시태그 배열', type: CreatePostDto })
    @ApiOkResponse({ description: '게시글 수정 완료', type: ResponseDto })
    async updatePost(
        @Param('id') postId: number,
        @Body() postData
    ): Promise<ResponseProp> {
        return await this.postService.updatePost(postId, postData)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: '게시글 삭제' })
    @ApiOkResponse({ description: '게시글 삭제 완료', type: ResponseDto })
    async deletePost(
        @Param('id') postId: number,
    ): Promise<ResponseProp> {
        return await this.postService.deletePost(postId)
    }
}
