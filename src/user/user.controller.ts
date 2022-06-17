import {
    Controller,
    UseGuards,
    Request,
    Param,
    Post,
    Body,
    Patch,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseProp } from 'src/_common/protocol';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@ApiBadRequestResponse({ description: '잘못된 요청' })
@ApiNotFoundResponse({ description: '리소스를 찾을 수 없음' })
@ApiUnauthorizedResponse({ description: '권한 부족' })
export class UserController {
    constructor (
        private readonly userService: UserService,
    ) {}

    @Post('create-user')
    @ApiOperation({ summary: '가입' })
    async createUser(
        @Body()
        userData: CreateUserDto
    ): Promise<ResponseProp> {
        return await this.userService.createUser(userData)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/follow')
    @ApiOperation({ summary: '팔로우 / 언팔로우' })
    @ApiBearerAuth('accesskey')
    async toggleFollow(
        @Request() req,
        @Param('id') otherUserId: number,
    ): Promise<ResponseProp> {
        return await this.userService.toggleFollow(req.user.id, otherUserId)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('like/:id')
    @ApiOperation({ summary: '게시글 좋아요 / 취소'})
    @ApiBearerAuth('accesskey')
    async toggleLike(
        @Request() req,
        @Param('id') postId: number
    ): Promise<ResponseProp> {
        return await this.userService.toggleLike(req.user.id, postId)
    }
}