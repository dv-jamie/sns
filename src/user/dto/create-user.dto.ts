import { PickType } from "@nestjs/swagger"
import { User } from "src/_entity/user.entity"

export class CreateUserDto extends PickType(User, [
    'uid',
    'upw'
] as const) {}