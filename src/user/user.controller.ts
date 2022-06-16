import {
    Controller,
    UseGuards,
    Request,
    Param,
    Post,
    Body,
    Patch,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseProp } from 'src/_common/protocol';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
    constructor (
        private readonly userService: UserService,
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
    ): Promise<ResponseProp> {
        return await this.userService.toggleFollow(req.user.id, otherUserId)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('like/:id')
    @ApiOperation({ summary: '게시글 좋아요 / 취소'})
    async toggleLike(
        @Request() req,
        @Param('id') postId: number
    ): Promise<boolean> {
        return await this.userService.toggleLike(req.user.id, postId)
    }
}