import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiUnauthorizedResponse,
    ApiOkResponse,
    ApiBody
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
@ApiTags('Login')
@ApiBadRequestResponse({ description: '잘못된 요청' })
@ApiNotFoundResponse({ description: '리소스를 찾을 수 없음' })
@ApiUnauthorizedResponse({ description: '권한 부족' })
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({ summary: '로그인' })
    @ApiBody({ description: '로그인 정보', type: LoginDto })
    @ApiOkResponse({ description: '로그인 성공' })
    async login(@Request() req) {
        return await this.authService.login(req.user)
    }
}
