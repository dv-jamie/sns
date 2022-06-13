import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, CreateDateColumn, JoinColumn, JoinTable, ManyToOne } from 'typeorm';
import { Comment } from './comment.entity';
import { Hashtag } from './hashtag.entity';
import { User } from './user.entity';

@Entity()
export class Post {
    @ApiProperty({ description: '인덱스' })
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id'
    })
    id: number;

    @ApiProperty({ description: '게시글 내용' })
    @IsString()
    @Column('varchar', {
        name: 'content',
        nullable: true,
        length: 2000
    })
    content?: string;

    @ApiProperty({ description: '게시글 등록일' })
    @CreateDateColumn({})
    createdAt: string;

    @ApiProperty({ description: '게시글 작성자' })
    @IsNumber()
    @ManyToOne((type) => User, (user) => user.posts)
    writer: User;

    @ApiProperty({ description: '댓글 리스트' })
    @ManyToMany((type) => Comment, (comment) => comment.post)
    comments: Comment[]

    @ApiProperty({ description: '해시태그 리스트' })
    @ManyToMany((type) => Hashtag, (hashtag) => hashtag.post)
    hashtags: Hashtag[]

    @ApiProperty({ description: '좋아요 누른 유저 리스트' })
    @ManyToMany((type) => User, (user) => user.likes)
    @JoinTable()
    likers: User;
}