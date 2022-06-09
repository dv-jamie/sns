import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, CreateDateColumn } from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity()
export class Hashtag {
    @ApiProperty({ description: '인덱스' })
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id'
    })
    id: number;

    @ApiProperty({ description: '해시태그 키워드' })
    @Column('varchar', {
        name: 'keyword',
        nullable: false,
        length: 30
    })
    keyword: string

    @ApiProperty({ description: '게시글' })
    @ManyToMany((type) => Post, (post) => post.hashtags)
    post: Post
}