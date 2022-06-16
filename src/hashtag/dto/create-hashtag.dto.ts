import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { Hashtag } from "src/_entity/hashtag.entity";

export class CreateHashtagDto {
    @IsArray()
    @ApiProperty({ description: '해시태그 키워드 배열' })
    keywords: string[]
}