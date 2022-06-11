import { ForbiddenException, HttpException, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/_entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<User>
    ) {}

    async createUser(userData: CreateUserDto): Promise<CreateUserDto> {
        const user = await this.userRepository.findOne({
            where: { username: userData.username }
        })

        if(user) {
            throw new HttpException('이미 존재하는 아이디입니다.', 401)
        }

        const result = await this.userRepository.save({
            ...userData
        })
        return result
    }

    async findUser(username: string, password: string): Promise<object> {
        console.log('User Service')
        
        const user = await this.userRepository.findOne({
            where: { username, password }
        })

        if(!user) {
            throw new ForbiddenException('아이디와 비밀번호를 다시 확인해주세요.')
        }

        return user
    }
    
}
