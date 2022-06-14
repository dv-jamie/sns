import { PickType } from "@nestjs/swagger";
import { Comment } from "src/_entity/comment.entity";

export class CreateCommentDto extends PickType(Comment, [
    'content',
    'writer'
] as const) {}