import { PickType } from "@nestjs/swagger";
import { PostEntity } from "src/_entity/post.entity";

export class CreatePostDto extends PickType(PostEntity, [
    'content',
] as const) {}