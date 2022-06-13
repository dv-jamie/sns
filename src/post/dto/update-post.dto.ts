import { PickType } from "@nestjs/swagger";
import { Post } from "src/_entity/post.entity";

export class UpdatePostDto extends PickType(Post, [
    'content',
    'writer'
] as const) {}