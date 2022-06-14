import { ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    UseGuards,
    Request,
    Param,
    Post,
    Body,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HashtagService } from './hashtag.service';

@Controller('hashtag')
export class HashtagController {
    constructor(private readonly hashtagService: HashtagService) {}

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
