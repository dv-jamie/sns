import * as bcrypt from 'bcrypt'
import { ForbiddenException, HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PostService } from 'src/post/post.service';
import { User } from 'src/_entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { bcryptConstant } from 'src/_common/constants';
import { ResponseProp } from 'src/_common/protocol';
import { LoginDto } from 'src/auth/dto/login.dto';

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<User>,
        private postService: PostService,
    ) {}

    async createUser(userData: CreateUserDto): Promise<CreateUserDto> {
        console.log('User Service - createUser')

        const hash = await bcrypt.hash(userData.password, bcryptConstant.saltOrRounds)
        const user = await this.userRepository.findOne({
            where: { userName: userData.userName }
        })

        if(user) {
            throw new HttpException('이미 존재하는 아이디입니다.', 401)
        }

        const result = await this.userRepository.save({
            userName: userData.userName,
            password: hash
        })
        
        return result
    }

    async findUser(userName: string, password: string): Promise<LoginDto> {
        console.log('User Service - findUser')

        const user = await this.userRepository.findOne({
            where: { userName }
        })
        
        if(!user) {
            throw new ForbiddenException('회원정보를 다시 확인해주세요.')
        }
        
        const hashedPassword = user.password
        const isMatch = await bcrypt.compare(password, hashedPassword)

        if(!isMatch) {
            throw new ForbiddenException('회원정보를 다시 확인해주세요.')
        }
        
        return user
    }

    async getUserById(userId: number): Promise<User> {
        console.log('User Service - findUserById')
        
        const user = await this.userRepository.findOne({
            where: { id: userId }
        })

        return user
    }

    async toggleFollow(reqUserId: number, otherUserId: number): Promise<ResponseProp> {
        console.log('User Service - toggleFollow')

        try {
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
            } else {
                console.log("팔로우 안하는 중 => 팔로우")
    
                reqUserWithOtherUser.followings = [...reqUserWithOtherUser.followings, otherUser]
            }
    
            await this.userRepository.save(reqUserWithOtherUser)
             
            return {
                status: 200,
                result: {
                    success: true
                }
            };
        } catch(e) {
            console.log(e)
        }
    }

    async toggleLike(userId: number, postId: number): Promise<boolean> {
        console.log('User service - toggleLikePost')

        const userWithLikes = await this.userRepository.findOne({
            where: {
                id: userId
            },
            relations: ['likes']
        })
        
        const post = await this.postService.getPostById(postId)

        if(!post) {
            throw new NotFoundException('존재하지 않는 게시글입니다.')
        }

        const likes = userWithLikes.likes.filter(
            like => like.id === post.id
        )

        if(likes.length > 0) {
            console.log('게시글 좋아요 중 => 취소')

            userWithLikes.likes = userWithLikes.likes.filter(
                like => like.id !== post.id
            )
        } else {
            console.log('게시글 좋아요 안 함 => 좋아요')
            
            userWithLikes.likes = [...userWithLikes.likes, post]
        }

        await this.userRepository.save(userWithLikes)
        return true
    }
}
