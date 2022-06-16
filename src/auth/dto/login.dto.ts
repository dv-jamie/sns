import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginDto {
    @IsString()
    @ApiProperty({ description: '유저 이름' })
    userName: string
    
    @IsString()
    @ApiProperty({ description: '유저 패스워드' })
    password: string
}