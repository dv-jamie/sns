import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: '게시글 등록' })
    async createPost(
        @Request() req,
        @Body() postData // 여기에 CreatedPostDto 추가하면 에러, service 인자에서는 에러 x
    ): Promise<object> {
        return await this.postService.createPost(req.user, postData)
    }
}
