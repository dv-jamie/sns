import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
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
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { Hashtag } from 'src/_entity/hashtag.entity';

@Controller('hashtag')
@ApiTags('Hashtags')
export class HashtagController {
    constructor(
        private readonly hashtagService: HashtagService,
        // private readonly postService: PostService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get(':id/post')
    @ApiOperation({ summary: '해시태그별 게시글 조회' })
    async getHashtagsByPost(
        @Request() req,
        @Param('id') hashtagId: number,
    ): Promise<PostEntity[]> {
        return await this.hashtagService.getPostsByHashtag(hashtagId)
        // return await this.postService.getPostByHashtag(hashtagId)
    }

    // @UseGuards(JwtAuthGuard)
    // @Post(':postId')
    // @ApiOperation({ summary: '해시태그 등록' })
    // @ApiParam({ name: 'postId', description: '해시태그를 등록할 게시글 id' })
    // @ApiBody({ description: '해시태그 키워드 입력' , type: CreateHashtagDto })
    // async createHashtag(
    //     @Param('postId') postId: number,
    //     @Body('keywords') keywords: string[]
    // ): Promise<boolean> {
    //     return await this.hashtagService.createHashtag(postId, keywords)
    // }
}
