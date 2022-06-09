import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) {}

    async createJwtToken(userData: LoginUserDto) {
        const user = await this.userService.findUser(userData)

        const jwtToken = this.jwtService.sign({ userId: user['id'] })

        return jwtToken
    }

    async validateUser(userData): Promise<any> {
        const user = await this.userService.findUser(userData)
    }
}
