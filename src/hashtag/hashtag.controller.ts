import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    Controller,
    UseGuards,
    Request,
    Param,
    Get,
    Post,
    Body,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HashtagService } from './hashtag.service';
import { PostService } from 'src/post/post.service';
import { PostEntity } from 'src/_entity/post.entity';

@Controller('hashtag')
@ApiTags('Hashtags')
export class HashtagController {
    constructor(
        private readonly hashtagService: HashtagService,
        private readonly postService: PostService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get(':id/post')
    @ApiOperation({ summary: '해시태그별 게시글 조회' })
    async getHashtagsByPost(
        @Request() req,
        @Param('id') hashtagId: number,
    ): Promise<PostEntity[]> {
        return await this.postService.getPostByHashtag(hashtagId)
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id')
    @ApiOperation({ summary: '해시태그 등록' })
    async createHashtag(
        @Request() req,
        @Param('id') postId: number,
        @Body('keywords') keywords: string[]
    ): Promise<boolean> {
        return await this.hashtagService.createHashtag(postId, keywords)
    }
}
