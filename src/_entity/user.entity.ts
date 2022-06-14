import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from './post.entity';

@Entity()
export class User {
    @ApiProperty({ description: '인덱스' })
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id'
    })
    id: number;

    @ApiProperty({ description: '유저 아이디' })
    @IsString()
    @Column('varchar', {
        name: 'username',
        unique: true,
        nullable: false,
        length: 30
    })
    username: string;

    @ApiProperty({ description: '유저 패스워드' })
    @IsString()
    @Column('varchar', {
        name: 'password',
        nullable: false,
        length: 30
    })
    password: string;

    @ApiProperty({ description: '팔로잉' })
    @IsArray()
    @ManyToMany((type) => User, (user) => user.followers)
    @JoinTable({
        joinColumn: { name: 'reqUserId' },
        inverseJoinColumn: { name: 'otherUserId' }
    })
    followings: User[]

    @ApiProperty({ description: '팔로워' })
    @IsArray()
    @ManyToMany((type) => User, (user) => user.followings)
    followers: User[]

    @ApiProperty({ description: '등록한 게시글 리스트' })
    @IsArray()
    @OneToMany((type) => Post, (post) => post.writer)
    posts: Post[]

    @ApiProperty({ description: '등록한 댓글 리스트' })
    @IsArray()
    @OneToMany((type) => Comment, (comment) => comment.writer)
    comments: Comment[]

    @ApiProperty({ description: '좋아요 누른 게시글 리스트' })
    @IsArray()
    @ManyToMany((type) => Post, (post) => post.likers)
    @JoinTable()
    likes: Post[]
}