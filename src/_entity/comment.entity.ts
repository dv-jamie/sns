import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
} from 'typeorm';
import { PostEntity } from './post.entity';
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
    @ManyToOne((type) => User, (user) => user.id)
    writer: number;

    @ApiProperty({ description: '게시글' })
    @ManyToOne((type) => PostEntity, (post) => post.id)
    post: number;
}