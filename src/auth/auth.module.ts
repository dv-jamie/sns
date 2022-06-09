import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { jwtConstants } from 'src/_common/constants';

@Module({
  imports: [UserModule, JwtModule.register({
    secret: jwtConstants.secret,
  })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
