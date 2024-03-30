import { Controller, Post, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreatUserDto } from './dto/crear-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreatUserDto) {
    return this.authService.create(createUserDto);
  }
}
