import { PickType } from "@nestjs/swagger";
import { Post } from "src/_entity/post.entity";

export class CreatePostDto extends PickType(Post, [
    'content',
] as const) {}