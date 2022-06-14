import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PostService } from 'src/post/post.service';
import { Hashtag } from 'src/_entity/hashtag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HashtagService {
    constructor(
        @Inject('HASHTAG_REPOSITORY')
        private readonly hashtagRepository: Repository<Hashtag>,
        private readonly postService: PostService
    ) {}

    async createHashtag(postId: number, keywords: string[]): Promise<boolean> {

        const post = await this.postService.getPostById(postId)

        if(!post) {
            throw new NotFoundException('존재하지 않는 게시글입니다.')
        }

        for(let keyword of keywords) {
            // 해시태그 테이블 조회
            let hashtagId = await this.hashtagRepository.findOne({
                select: ['id'],
                where: { keyword }
            })

            // 해시태그가 없을 경우에만 추가
            if(!hashtagId) {
                const insertResult = await this.hashtagRepository
                    .createQueryBuilder()
                    .insert()
                    .into(Hashtag)
                    .values({ keyword })
                    .execute()

                hashtagId = insertResult.identifiers[0].id
            }

            // *** 해시태그 id + 게시글 id 중복일 때?
            // const hashtagPost = await this.hashtagRepository
            //     .createQueryBuilder()
            //     .select('hashtag_post')
            //     .from('hashtag_post', 'hashtag_post')
            //     .where({ hashtagId, postId })
            //     .getOne()
            
            // console.log(hashtagPost) // null

            await this.hashtagRepository
                .createQueryBuilder()
                .insert()
                .into('hashtag_post')
                .values({ hashtagId, postId })
                .execute()
        }

        return true
    }
}
