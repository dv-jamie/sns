import { Inject, Injectable } from '@nestjs/common';
import { ResponseProp } from 'src/_common/protocol';
import { Hashtag } from 'src/_entity/hashtag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HashtagService {
    constructor(
        @Inject('HASHTAG_REPOSITORY')
        private readonly hashtagRepository: Repository<Hashtag>,
    ) {}

    async getPostsByHashtag(hashtagId: number): Promise<ResponseProp> {
        try {
            const hashtag = await this.hashtagRepository.findOne({
                where: {
                    id: hashtagId
                },
                relations: ['posts']
            })
    
            return {
                status: 200,
                result: {
                    success: hashtag.posts
                }
            }
        } catch(e) {
            console.log(e)

            return {
                status: e.status,
                result: {
                    error: e.message
                }
            }
        }
    }

    async createHashtag(
        postId: number,
        keywords: string[]
    )
    : Promise<ResponseProp> {
        try {
            for(let keyword of keywords) {
                // 해시태그 테이블 조회
                let hashtagId = await this.hashtagRepository.findOne({
                    select: ['id'],
                    where: { keyword }
                })
    
                let hashtagPost: Hashtag;
    
                // 해시태그가 없을 경우에만 추가
                if(!hashtagId) {
                    const insertResult = await this.hashtagRepository
                        .createQueryBuilder()
                        .insert()
                        .into(Hashtag)
                        .values({ keyword })
                        .execute()
    
                    hashtagId = insertResult.identifiers[0].id;
                } else {
                    hashtagPost = await this.hashtagRepository
                    .createQueryBuilder('hashtag')
                    .leftJoinAndSelect('hashtag.posts', 'posts')
                    .where(`hashtag.id = ${hashtagId.id}`
                    )
                    .andWhere(`posts.id = ${postId}`)
                    .getOne()
                }
    
                // *** 해시태그 id + 게시글 id 중복일 때?
                // console.log('hashtagPost: ', hashtagPost) // null
    
                if (!hashtagPost) {
                    await this.hashtagRepository
                        .createQueryBuilder()
                        .insert()
                        .into('hashtag_post')
                        .values({ hashtagId, postEntityId: postId })
                        .execute()
                }
            }
    
            return {
                status: 200,
                result: {
                    success: '해시태그 생성 완료'
                }
            }
        } catch(e) {
            console.log(e)

            return {
                status: e.status,
                result: {
                    error: e.message
                }
            }
        }
    }
}
