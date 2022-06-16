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
import { ResponseDto } from 'src/_common/dto/response.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('post')
@ApiTags('Post')
@ApiBearerAuth('accesskey')
export class PostController {
    constructor(private readonly postService: PostService) {}

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
    @Get('/hashtag/:id')
    @ApiOperation({ summary: '해시태그별 게시글 불러오기' })
    @ApiOkResponse({ description: '게시글 불러오기 완료', type: ResponseDto })
    async getPostByHashtag(
        @Request() req,
        @Param('id') hashtagId: number
    ): Promise<object> {
        return await this.postService.getPostByHashtag(hashtagId)
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: '게시글 등록' })
    @ApiBody({ description: '게시글 내용', type: CreatePostDto })
    @ApiOkResponse({ description: '게시글 등록 완료', type: ResponseDto })
    async createPost(
        @Request() req,
        @Body() postData: {content: string}
    ): Promise<object> {
        console.log(postData)
        return await this.postService.createPost(req.user.id, postData)
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
