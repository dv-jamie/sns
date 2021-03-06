import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, Matches, MinLength } from 'class-validator';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Comment } from './comment.entity';
import { PostEntity } from './post.entity';

@Entity()
export class User {
    @ApiProperty({ description: '인덱스' })
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id'
    })
    id: number;

    @ApiProperty({ description: '영문으로 시작, 숫자+언더바/하이픈 허용, 4~20자' })
    @IsString()
    @Matches(/^[A-Za-z]{1}[A-Za-z0-9_-]{3,19}$/ )
    @Column('varchar', {
        name: 'userName',
        unique: true,
        nullable: false,
        length: 30
    })
    userName: string;

    @ApiProperty({ description: '문자, 숫자 1개 이상 포함, 8자 이상' })
    @IsString()
    @Matches(/(?=.*\d)(?=.*[a-zA-ZS]).{8,}/)
    @Column('varchar', {
        name: 'password',
        nullable: false,
        length: 60
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
    @ManyToMany((type) => User, (user) => user.followings, {
        onDelete: 'CASCADE'
    })
    followers: User[]

    @ApiProperty({ description: '등록한 게시글 리스트' })
    @IsArray()
    @OneToMany((type) => PostEntity, (post) => post.writer)
    posts: PostEntity[]

    @ApiProperty({ description: '등록한 댓글 리스트' })
    @IsArray()
    @OneToMany((type) => Comment, (comment) => comment.writer)
    comments: Comment[]

    @ApiProperty({ description: '좋아요 누른 게시글 리스트' })
    @IsArray()
    @ManyToMany((type) => PostEntity, (post) => post.likers)
    @JoinTable()
    likes: PostEntity[]
}