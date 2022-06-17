import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    Controller,
    UseGuards,
    Param,
    Get,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HashtagService } from './hashtag.service';
import { ResponseProp } from 'src/_common/protocol';

@Controller('hashtag')
@ApiTags('Hashtags')
@ApiBearerAuth('accesskey')
export class HashtagController {
    constructor(
        private readonly hashtagService: HashtagService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get(':id/post')
    @ApiOperation({ summary: '해시태그별 게시글 조회' })
    async getHashtagsByPost(
        @Param('id') hashtagId: number,
    ): Promise<ResponseProp> {
        return await this.hashtagService.getPostsByHashtag(hashtagId)
    }
}
