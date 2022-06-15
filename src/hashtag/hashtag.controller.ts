import { ApiOperation } from '@nestjs/swagger';
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
import { Hashtag } from 'src/_entity/hashtag.entity';

@Controller('hashtag')
export class HashtagController {
    constructor(private readonly hashtagService: HashtagService) {}

    @UseGuards(JwtAuthGuard)
    @Get('post/:id')
    @ApiOperation({ summary: '게시글별 해시태그 조회' })
    async getHashtagsByPost(
        @Request() req,
        @Param('id') postId: number,
    ): Promise<Hashtag[]> {
        return await this.hashtagService.getHashtagsByPost(postId)
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
