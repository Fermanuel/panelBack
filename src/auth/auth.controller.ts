import { Controller, Post, Body, Get, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreatUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreatUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  LoginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }


  @Get('private')
  @UseGuards(AuthGuard())
  testPrivate() {
    return {
      message: 'This is a private route',
      ok: true,
      user: {name: 'Fernado'}
    }
  }
}
