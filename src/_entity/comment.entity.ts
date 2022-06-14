import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany
} from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity()
export class Comment {
    @ApiProperty({ description: '인덱스' })
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id'
    })
    id: number;

    @ApiProperty({ description: '댓글 내용' })
    @Column('varchar', {
        name: 'content',
        nullable: false,
        length: 200
    })
    content: string;

    @ApiProperty({ description: '댓글 작성일' })
    @CreateDateColumn()
    createdAt: string;

    @ApiProperty({ description: '댓글 작성자' })
    @IsNumber()
    @ManyToOne((type) => User, (user) => user.comments)
    writer: User;

    @ApiProperty({ description: '게시글' })
    @ManyToOne((type) => Post, (post) => post.comments)
    post: Post;
}