import { IsString } from "class-validator";

export class LoginUserDto {
    @IsString()
    uid: string;

    @IsString()
    upw: string;
}