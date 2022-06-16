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
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { ResponseDto } from 'src/_common/dto/response.dto';
import { Hashtag } from 'src/_entity/hashtag.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('post')
@ApiTags('Post')
@ApiBearerAuth('accesskey')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly hashtagService: HashtagService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: '유저별 게시글 불러오기' })
    @ApiOkResponse({ description: '게시글 불러오기 완료', type: ResponseDto })
    async getPostByUser(
        @Request() req,
    ): Promise<object> {
        return await this.postService.getPostByUser(req.user.id)
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiOperation({ summary: '하나의 게시글 불러오기' })
    @ApiOkResponse({ description: '게시글 불러오기 완료', type: ResponseDto })
    async getPostById(
        @Request() req,
        @Param('id') postId: number
    ): Promise<object> {
        return await this.postService.getPostById(postId)
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/hashtag')
    @ApiOperation({ summary: '게시글별 해시태그 불러오기' })
    @ApiOkResponse({ description: '해시태그 불러오기 완료', type: ResponseDto })
    async getPostByHashtag(
        @Request() req,
        @Param('id') hashtagId: number
    ): Promise<Hashtag[]> {
        return await this.hashtagService.getHashtagsByPost(hashtagId)
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: '게시글 등록' })
    @ApiBody({ description: '게시글 내용', type: CreatePostDto })
    @ApiOkResponse({ description: '게시글 등록 완료', type: ResponseDto })
    async createPost(
        @Request() req,
        @Body('content') content: string,
        @Body('keywords') hashtags: string[]
    ): Promise<object> {
        return await this.postService.createPost(req.user.id, content, hashtags)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @ApiOperation({ summary: '게시글 수정' })
    @ApiOkResponse({ description: '게시글 수정 완료', type: ResponseDto })
    async updatePost(
        @Param('id') postId: number,
        @Body() postData
    ): Promise<number> {
        return await this.postService.updatePost(postId, postData)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: '게시글 삭제' })
    @ApiOkResponse({ description: '게시글 삭제 완료', type: ResponseDto })
    async deletePost(
        @Param('id') postId: number,
    ): Promise<number> {
        return await this.postService.deletePost(postId)
    }
}
