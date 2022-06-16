import { PickType } from "@nestjs/swagger";
import { PostEntity } from "src/_entity/post.entity";

export class UpdatePostDto extends PickType(PostEntity, [
    'content',
    'hashtags'
] as const) {}