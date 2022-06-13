import { Body, Controller, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostService } from 'src/post/post.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor (
        private readonly userService: UserService,
        private readonly postService: PostService
    ) {}

    @Post('create-user')
    @ApiOperation({ summary: '가입' })
    async createUser(
        @Body()
        userData: CreateUserDto
    ): Promise<object> {
        return await this.userService.createUser(userData)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/follow')
    @ApiOperation({ summary: '팔로우 / 언팔로우' })
    async toggleFollow(
        @Request() req,
        @Param('id') otherUserId: number,
    ): Promise<boolean> {
        return await this.userService.toggleFollow(req.user.id, otherUserId)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('like/:id')
    @ApiOperation({ summary: '게시글 좋아요 / 취소'})
    async toggleLike(
        @Request() req,
        @Param('id') postId: number
    ): Promise<boolean> {
        const post = await this.postService.getOnePost(postId)
        return await this.userService.toggleLike(req.user.id, post) 
    }
}