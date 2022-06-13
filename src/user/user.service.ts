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
        console.log('User Service - createUser')

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
        console.log('User Service - fundUser')
        
        const user = await this.userRepository.findOne({
            where: { username, password }
        })

        if(!user) {
            throw new ForbiddenException('아이디와 비밀번호를 다시 확인해주세요.')
        }

        return user
    }

    async toggleFollow(reqUserId: number, otherUserId: number) {
        console.log('User Service - toggleFollow')

        const reqUserWithOtherUser = await this.userRepository.findOne({
            where: {
                id: reqUserId,
            },
            relations: ['followings']
        })

        const otherUser = await this.userRepository.findOne({
            where: {
                id: otherUserId
            }
        })

        const followingUserList = (reqUserWithOtherUser.followings.filter(
            followingUser => followingUser.id === otherUserId
        ))

        if(followingUserList.length > 0) {
            console.log("상대방 팔로우 중 => 언팔로우")

            reqUserWithOtherUser.followings = reqUserWithOtherUser.followings.filter(
                followingUser => followingUser.id !== otherUserId
            )
            await this.userRepository.save(reqUserWithOtherUser)
            return true
        } else {
            console.log("팔로우 안하는 중 => 팔로우")

            reqUserWithOtherUser.followings = [...reqUserWithOtherUser.followings, otherUser]
            await this.userRepository.save(reqUserWithOtherUser)
            return true
        }
    }
}
