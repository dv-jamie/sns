import { ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    UseGuards,
    Request,
    Param,
    Post,
    Get,
    Body,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HashtagService } from './hashtag.service';

@Controller('hashtag')
export class HashtagController {
    constructor(private readonly hashtagService: HashtagService) {}

    // *******************************
    // @UseGuards(JwtAuthGuard)
    // @Get(':id')
    // @ApiOperation({ summary: '해시태그에 연결된 게시글 모두 조회' })
    // async getPostsByHashtag(
    //     @Request() req,
    //     @Param('id') hashtagId: number,
    // ): Promise<any> {
    //     return await this.hashtagService.getPostsByHashtag(hashtagId)
    // }

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
