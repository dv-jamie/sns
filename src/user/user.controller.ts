import { Body, Controller, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor (private readonly userService: UserService) {}

    @Post('create-user')
    @ApiOperation({ summary: '가입' })
    async createUser(
        @Body()
        userData: CreateUserDto
    ): Promise<object> {
        return await this.userService.createUser(userData)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('follow/:id')
    @ApiOperation({ summary: '팔로우 / 언팔로우' })
    async toggleFollow(
        @Request() req,
        @Param('id') otherUserId: number,
    ) {
        return await this.userService.toggleFollow(req.user.id, otherUserId)
    }
}