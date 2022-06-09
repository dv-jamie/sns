import { HttpException, Inject, Injectable } from '@nestjs/common';
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
            where: { uid: userData.uid }
        })

        if(user) {
            throw new HttpException('이미 존재하는 아이디입니다.', 401)
        }

        const result = await this.userRepository.save({
            ...userData
        })
        return result
    }

    async findUser(userData: LoginUserDto): Promise<object> {
        const user = await this.userRepository.findOne({
            where: {
                uid: userData.uid,
                upw: userData.upw
            }
        })

        if(!user) {
            throw new HttpException('아이디 혹은 비밀번호가 일치하지 않습니다.', 401)
        }

        return user
    }
    
}
