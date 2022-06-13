import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) {}

    // async createJwtToken(userData: LoginUserDto) {
    //     const user = await this.userService.findUser(userData)

    //     const jwtToken = this.jwtService.sign({ userId: user['id'] })

    //     return jwtToken
    // }

    async validateUser(username: string, password: string): Promise<any> {
        console.log('Auth service - validateUser')

        const user = await this.userService.findUser(username, password)
        
        return user
    }

    async login(user: any) {
        console.log('Auth service - login')

        return this.jwtService.sign(user.id)
    }
}
