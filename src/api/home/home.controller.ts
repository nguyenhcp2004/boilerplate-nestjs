import { ApiPublic } from '@/decorators/http.decorators';
import { Controller } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('/')
export class HomeController {
  @AllowAnonymous()
  @ApiPublic({ summary: 'Home' })
  home() {
    return 'Welcome to the API';
  }
}
