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

    async createUser(userData): Promise<ResponseProp> {
        console.log('User Service - createUser')

        try {
            const hash = await bcrypt.hash(userData.password, bcryptConstant.saltOrRounds)
            const user = await this.userRepository.findOne({
                where: { userName: userData.userName }
            })
    
            if(user) {
                throw new HttpException('이미 존재하는 아이디입니다.', 401)
            }
    
            await this.userRepository.save({
                userName: userData.userName,
                password: hash
            })
            
            return {
                status: 200,
                result: {
                    success: '유저 생성 완료'
                }
            }
        } catch(e) {
            console.log(e)

            return {
                status: e.status,
                result: {
                    error: e.response.message
                }
            }
        }
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

    async getUserById(userId: number): Promise<ResponseProp> {
        console.log('User Service - findUserById')
        
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId }
            })
    
            return {
                status: 200,
                result: {
                    success: user
                }
            }
        } catch(e) {
            console.log(e)

            return {
                status: e.status,
                result: {
                    error: e.response.message
                }
            }
        }
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

            let isFollow: boolean
    
            if(followingUserList.length > 0) {
                console.log("상대방 팔로우 중 => 언팔로우")
    
                reqUserWithOtherUser.followings = reqUserWithOtherUser.followings.filter(
                    followingUser => followingUser.id !== otherUserId
                )
                isFollow = false
            } else {
                console.log("팔로우 안하는 중 => 팔로우")
    
                reqUserWithOtherUser.followings = [...reqUserWithOtherUser.followings, otherUser]
                isFollow = true
            }
    
            await this.userRepository.save(reqUserWithOtherUser)
             
            return {
                status: 200,
                result: {
                    success: isFollow
                }
            };
        } catch(e) {
            console.log(e)

            return {
                status: e.status,
                result: {
                    error: e.response.message
                }
            }
        }
    }

    async toggleLike(userId: number, postId: number): Promise<ResponseProp> {
        console.log('User service - toggleLikePost')

        try {
            const userWithLikes = await this.userRepository.findOne({
                where: {
                    id: userId
                },
                relations: ['likes']
            })
            
            const responseProp = await this.postService.getPostById(postId)
            const post = responseProp.result.success

            if(!post) {
                throw new NotFoundException('존재하지 않는 게시글입니다.')
            }
    
            const likes = userWithLikes.likes.filter(
                like => like.id === post.id
            )

            let isLike: boolean
    
            if(likes.length > 0) {
                console.log('게시글 좋아요 중 => 취소')
    
                userWithLikes.likes = userWithLikes.likes.filter(
                    like => like.id !== post.id
                )
                isLike = false
            } else {
                console.log('게시글 좋아요 안 함 => 좋아요')
                
                userWithLikes.likes = [...userWithLikes.likes, post]
                isLike = true
            }
    
            await this.userRepository.save(userWithLikes)
            
            return {
                status: 200,
                result: {
                    success: isLike
                }
            }
        } catch(e) {
            console.log(e)

            return {
                status: e.status,
                result: {
                    error: e.response.message
                }
            }
        }
    }
}
