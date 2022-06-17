import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) {}

    async validateUser(userName: string, password: string): Promise<any> {
        console.log('Auth service - validateUser')

        const user = await this.userService.findUser(userName, password)
        
        return user
    }

    async login(user: any) {
        console.log('Auth service - login')

        return this.jwtService.sign(user.id)
    }
}
