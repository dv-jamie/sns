import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Main')
export class AppController {

  @Get()
  getHello(): string {
    return "Welcome!"
  }
}
