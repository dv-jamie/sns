import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { PostEntity } from './post.entity';

@Entity()
export class Hashtag {
    @ApiProperty({ description: '인덱스' })
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id'
    })
    id: number;

    @ApiProperty({ description: '해시태그 키워드' })
    @IsString()
    @Column('varchar', {
        name: 'keyword',
        nullable: false,
        length: 30
    })
    keyword: string

    @ApiProperty({ description: '게시글 리스트' })
    @IsNumber()
    @ManyToMany((type) => PostEntity, (post) => post.hashtags)
    @JoinTable({
        name: 'hashtag_post'
    })
    posts: PostEntity[]
}