import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post()
    @ApiOperation({ summary: '게시글 등록' })
    async createPost(
        @Body()
        postData: CreatePostDto
    ) {
        return this.postService.createPost(postData)
    }
}
